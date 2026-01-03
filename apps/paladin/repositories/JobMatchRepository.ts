/**
 * JobMatchRepository
 * Handles CRUD operations for job matches
 */

import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';
import { inject, repository } from '@razvan11/paladin';
import { JobMatchEntity, type MatchStatus } from '../entities/JobMatchEntity';

interface FindMatchesOptions {
  status?: string;
  minScore?: number;
  limit?: number;
  offset?: number;
}

@repository()
export class JobMatchRepository {
  constructor(@inject(PrimaryDatabase) private db: PrimaryDatabase) {}

  async findByUserId(
    userId: string,
    options?: FindMatchesOptions,
  ): Promise<JobMatchEntity[]> {
    const repo = await this.db.open(JobMatchEntity);

    const queryBuilder = repo
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.job', 'job')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId });

    if (options?.status) {
      queryBuilder.andWhere('match.status = :status', {
        status: options.status,
      });
    }

    if (options?.minScore !== undefined) {
      queryBuilder.andWhere('match.compatibilityScore >= :minScore', {
        minScore: options.minScore,
      });
    }

    queryBuilder.orderBy('match.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }

    if (options?.offset) {
      queryBuilder.skip(options.offset);
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<JobMatchEntity | null> {
    const repo = await this.db.open(JobMatchEntity);
    return repo.findOne({
      where: { id },
      relations: ['job'],
    });
  }

  async create(match: Partial<JobMatchEntity>): Promise<JobMatchEntity> {
    const repo = await this.db.open(JobMatchEntity);
    const result = await repo.save(match);
    return result;
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<JobMatchEntity | null> {
    const repo = await this.db.open(JobMatchEntity);
    const match = await repo.findOne({ where: { id } });
    if (!match) return null;

    match.status = status as MatchStatus;

    // Set related timestamps
    const now = new Date();
    if (status === 'viewed') match.viewedAt = now;
    if (status === 'saved') match.savedAt = now;
    if (status === 'applied') match.appliedAt = now;
    if (status === 'dismissed') match.dismissedAt = now;

    await repo.save(match);
    return match;
  }

  async getStatsByUserId(userId: string): Promise<{
    total: number;
    matched: number;
    applied: number;
    new: number;
    saved: number;
  }> {
    const repo = await this.db.open(JobMatchEntity);

    const total = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .getCount();

    const newCount = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('match.status = :status', { status: 'new' })
      .getCount();

    const saved = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('match.status = :status', { status: 'saved' })
      .getCount();

    const applied = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('match.status = :status', { status: 'applied' })
      .getCount();

    const matched = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('match.status = :status', { status: 'viewed' })
      .getCount();

    return { total, matched, applied, new: newCount, saved };
  }

  async refreshMatchesForUser(
    userId: string,
  ): Promise<{ refreshed: boolean; newMatches: number; totalMatches: number }> {
    const repo = await this.db.open(JobMatchEntity);

    // Import required entities/repos for matching
    const { JobListingEntity } = await import('../entities/JobListingEntity');
    const { UserJobPreferencesEntity } = await import(
      '../entities/UserJobPreferencesEntity'
    );

    const jobRepo = await this.db.open(JobListingEntity);
    const prefsRepo = await this.db.open(UserJobPreferencesEntity);

    // Get user preferences
    const preferences = await prefsRepo.findOne({
      where: { user: { id: userId } },
    });

    // Get all active jobs
    const jobs = await jobRepo.find({
      where: { isActive: true },
      order: { postedAt: 'DESC' },
      take: 100,
    });

    if (jobs.length === 0) {
      return { refreshed: true, newMatches: 0, totalMatches: 0 };
    }

    // Get existing matches for this user to avoid duplicates
    const existingMatches = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .leftJoin('match.job', 'job')
      .where('user.id = :userId', { userId })
      .select(['match.id', 'job.id'])
      .getRawMany();

    const existingJobIds = new Set(existingMatches.map((m) => m.job_id));

    let newMatchCount = 0;

    for (const job of jobs) {
      // Skip if already matched
      if (existingJobIds.has(job.id)) continue;

      // Calculate compatibility score
      const score = this.calculateCompatibilityScore(job, preferences);

      // Only create match if score is above threshold (e.g., 30%)
      if (score.overall >= 30) {
        const match = new JobMatchEntity();
        match.user = { id: userId } as any;
        match.job = job;
        match.compatibilityScore = score.overall;
        match.skillsScore = score.skills;
        match.keywordsScore = score.keywords;
        match.experienceScore = score.experience;
        match.educationScore = score.education;
        match.semanticScore = 0;
        match.matchedSkills = score.matchedSkills;
        match.missingSkills = score.missingSkills;
        match.matchedKeywords = score.matchedKeywords;
        match.missingKeywords = score.missingKeywords;
        match.status = 'new';

        try {
          await repo.save(match);
          newMatchCount++;
        } catch (error) {
          // Skip duplicate entries
        }
      }
    }

    const totalMatches = await repo
      .createQueryBuilder('match')
      .leftJoin('match.user', 'user')
      .where('user.id = :userId', { userId })
      .getCount();

    return { refreshed: true, newMatches: newMatchCount, totalMatches };
  }

  private calculateCompatibilityScore(
    job: any,
    preferences: any | null,
  ): {
    overall: number;
    skills: number;
    keywords: number;
    experience: number;
    education: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  } {
    let skillsScore = 50; // Default base score
    let keywordsScore = 50;
    let experienceScore = 50;
    const educationScore = 50;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    if (preferences) {
      const userSkills = (preferences.skills || []).map((s: string) =>
        s.toLowerCase(),
      );
      const userKeywords = (preferences.resumeKeywords || []).map((k: string) =>
        k.toLowerCase(),
      );

      // Skills matching
      const jobSkills = [
        ...(job.requiredSkills || []),
        ...(job.preferredSkills || []),
      ].map((s: string) => s.toLowerCase());

      for (const skill of jobSkills) {
        if (
          userSkills.some(
            (us: string) => us.includes(skill) || skill.includes(us),
          )
        ) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }

      if (jobSkills.length > 0) {
        skillsScore = Math.round(
          (matchedSkills.length / jobSkills.length) * 100,
        );
      }

      // Keywords matching
      const jobKeywords = (job.keywords || []).map((k: string) =>
        k.toLowerCase(),
      );
      for (const keyword of jobKeywords) {
        if (
          userKeywords.some(
            (uk: string) => uk.includes(keyword) || keyword.includes(uk),
          )
        ) {
          matchedKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      }

      if (jobKeywords.length > 0) {
        keywordsScore = Math.round(
          (matchedKeywords.length / jobKeywords.length) * 100,
        );
      }

      // Experience matching
      if (preferences.yearsExperience && job.yearsExperienceMin) {
        if (preferences.yearsExperience >= job.yearsExperienceMin) {
          experienceScore = 100;
        } else {
          experienceScore = Math.round(
            (preferences.yearsExperience / job.yearsExperienceMin) * 100,
          );
        }
      }

      // Location/remote preference matching
      if (preferences.isRemotePreferred && job.isRemote) {
        skillsScore = Math.min(100, skillsScore + 10);
      }
    }

    // Calculate overall score (weighted average)
    const overall = Math.round(
      skillsScore * 0.35 +
        keywordsScore * 0.25 +
        experienceScore * 0.25 +
        educationScore * 0.15,
    );

    return {
      overall: Math.min(100, Math.max(0, overall)),
      skills: Math.min(100, Math.max(0, skillsScore)),
      keywords: Math.min(100, Math.max(0, keywordsScore)),
      experience: Math.min(100, Math.max(0, experienceScore)),
      education: Math.min(100, Math.max(0, educationScore)),
      matchedSkills,
      missingSkills: missingSkills.slice(0, 10), // Limit to 10
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 10),
    };
  }
}
