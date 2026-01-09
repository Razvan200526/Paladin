import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import {
  JobMatchEntity,
  type MatchStatus,
} from '../apps/paladin/entities/JobMatchEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';
import { JobListingEntity } from '../apps/paladin/entities/JobListingEntity';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';

const skills = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'React',
  'Node.js',
  'AWS',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'GraphQL',
  'REST API',
  'Git',
  'CI/CD',
  'Agile',
  'Scrum',
  'Machine Learning',
  'Data Analysis',
];

const keywords = [
  'software',
  'development',
  'engineering',
  'programming',
  'coding',
  'design',
  'management',
  'leadership',
  'analytics',
  'strategy',
  'architecture',
  'scalability',
  'performance',
  'optimization',
  'automation',
];

const improvementSuggestions = [
  'Consider adding more experience with cloud platforms',
  'Highlight your leadership experience more prominently',
  'Add specific metrics to quantify your achievements',
  'Include more relevant keywords from the job description',
  'Emphasize your problem-solving skills with concrete examples',
  'Add certifications that are relevant to this role',
  'Expand on your technical skills section',
  'Include more details about your project management experience',
];

const statuses: MatchStatus[] = ['new', 'viewed', 'saved', 'applied', 'dismissed'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateScore(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

export async function seedJobMatches(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const jobRepo = await db.open(JobListingEntity);
  const resumeRepo = await db.open(ResumeEntity);
  const matchRepo = await db.open(JobMatchEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const jobs = await jobRepo.find();
  if (jobs.length === 0) {
    throw new Error('No job listings found. Please seed job listings first.');
  }

  const resumes = await resumeRepo.find({ relations: ['user'] });
  const matches: JobMatchEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const job = getRandomElement(jobs);
    const userResumes = resumes.filter((r) => r.user?.id === user.id);
    const resume =
      userResumes.length > 0 && Math.random() > 0.3
        ? getRandomElement(userResumes)
        : undefined;

    // Generate scores (0-100)
    const skillsScore = generateScore(50, 95);
    const experienceScore = generateScore(40, 90);
    const educationScore = generateScore(60, 100);
    const keywordsScore = generateScore(45, 95);
    const semanticScore = generateScore(55, 98);

    // Overall compatibility score (weighted average)
    const compatibilityScore = Number(
      (
        skillsScore * 0.3 +
        experienceScore * 0.25 +
        educationScore * 0.15 +
        keywordsScore * 0.15 +
        semanticScore * 0.15
      ).toFixed(2),
    );

    const match = new JobMatchEntity();
    match.id = random.nanoid(15);
    match.user = user;
    match.job = job;
    match.resume = resume;
    match.compatibilityScore = compatibilityScore;
    match.skillsScore = skillsScore;
    match.experienceScore = experienceScore;
    match.educationScore = educationScore;
    match.keywordsScore = keywordsScore;
    match.semanticScore = semanticScore;

    // Generate matched and missing skills
    const jobSkills = job.requiredSkills.concat(job.preferredSkills);
    const matchedSkills = getRandomElements(jobSkills, 3, Math.min(8, jobSkills.length));
    const allSkills = [...new Set([...skills, ...jobSkills])];
    const missingSkills = allSkills
      .filter((s) => !matchedSkills.includes(s))
      .slice(0, Math.floor(Math.random() * 5) + 1);

    match.matchedSkills = matchedSkills;
    match.missingSkills = missingSkills;

    // Generate matched and missing keywords
    const jobKeywords = job.keywords;
    const matchedKeywords = getRandomElements(
      jobKeywords,
      2,
      Math.min(6, jobKeywords.length),
    );
    const allKeywords = [...new Set([...keywords, ...jobKeywords])];
    const missingKeywords = allKeywords
      .filter((k) => !matchedKeywords.includes(k))
      .slice(0, Math.floor(Math.random() * 4) + 1);

    match.matchedKeywords = matchedKeywords;
    match.missingKeywords = missingKeywords;

    // Improvement suggestions
    match.improvementSuggestions = getRandomElements(
      improvementSuggestions,
      2,
      5,
    );

    // Status
    match.status = getRandomElement(statuses);
    match.isNotified = Math.random() > 0.5;

    // Set status-specific dates
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    );
    match.createdAt = createdAt;

    if (match.status === 'viewed') {
      match.viewedAt = new Date(
        createdAt.getTime() +
          Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
      );
    } else if (match.status === 'saved') {
      match.savedAt = new Date(
        createdAt.getTime() +
          Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000,
      );
    } else if (match.status === 'applied') {
      match.appliedAt = new Date(
        createdAt.getTime() +
          Math.floor(Math.random() * 21) * 24 * 60 * 60 * 1000,
      );
    } else if (match.status === 'dismissed') {
      match.dismissedAt = new Date(
        createdAt.getTime() +
          Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
      );
    }

    match.updatedAt =
      match.status !== 'new'
        ? new Date(
            createdAt.getTime() +
              Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000,
          )
        : undefined;

    matches.push(match);
  }

  await matchRepo.save(matches);
  return matches.length;
}
