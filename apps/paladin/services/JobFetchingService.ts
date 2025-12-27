/**
 * Job Fetching Service
 * Migrated from easyres with @service decorator
 * Fetches jobs from external APIs (Remotive, Arbeitnow)
 */
import { inject, service } from '@razvan11/paladin';
import { JobListingEntity } from '../entities/JobListingEntity';
import { PrimaryDatabase } from '../shared/database/PrimaryDatabase';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

interface RemotiveResponse {
  'job-count': number;
  jobs: RemotiveJob[];
}

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: { next: string | null };
}

@service()
export class JobFetchingService {
  constructor(@inject(PrimaryDatabase) private db: PrimaryDatabase) {}

  /**
   * Fetch jobs from Remotive API (remote jobs)
   */
  async fetchFromRemotive(
    category?: string,
    limit = 50,
  ): Promise<JobListingEntity[]> {
    try {
      const url = category
        ? `https://remotive.com/api/remote-jobs?category=${encodeURIComponent(category)}&limit=${limit}`
        : `https://remotive.com/api/remote-jobs?limit=${limit}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Remotive API error: ${response.status}`);
      }

      const data = (await response.json()) as RemotiveResponse;
      const jobs: JobListingEntity[] = [];

      for (const job of data.jobs) {
        const existingJob = await this.findExistingJob(String(job.id));
        if (existingJob) continue;

        const jobEntity = new JobListingEntity();
        jobEntity.externalId = String(job.id);
        jobEntity.source = 'other';
        jobEntity.title = job.title;
        jobEntity.company = job.company_name;
        jobEntity.companyLogo = job.company_logo || undefined;
        jobEntity.location = job.candidate_required_location || 'Remote';
        jobEntity.isRemote = true;
        jobEntity.description = this.stripHtml(job.description);
        jobEntity.descriptionHtml = job.description;
        jobEntity.jobType = this.mapJobType(job.job_type);
        jobEntity.url = job.url;
        jobEntity.applyUrl = job.url;
        jobEntity.keywords = job.tags;
        jobEntity.benefits = this.extractBenefits(job.description);
        jobEntity.isActive = true;
        jobEntity.postedAt = new Date(job.publication_date);

        if (job.salary) {
          const salaryInfo = this.parseSalary(job.salary);
          jobEntity.salaryMin = salaryInfo.min;
          jobEntity.salaryMax = salaryInfo.max;
          jobEntity.salaryCurrency = salaryInfo.currency;
        }

        jobs.push(jobEntity);
      }

      return jobs;
    } catch (error) {
      console.error('Error fetching from Remotive:', error);
      return [];
    }
  }

  /**
   * Fetch jobs from Arbeitnow API
   */
  async fetchFromArbeitnow(limit = 50): Promise<JobListingEntity[]> {
    try {
      const response = await fetch(
        `https://www.arbeitnow.com/api/job-board-api?per_page=${limit}`,
      );
      if (!response.ok) {
        throw new Error(`Arbeitnow API error: ${response.status}`);
      }

      const data = (await response.json()) as ArbeitnowResponse;
      const jobs: JobListingEntity[] = [];

      for (const job of data.data) {
        const existingJob = await this.findExistingJob(job.slug);
        if (existingJob) continue;

        const jobEntity = new JobListingEntity();
        jobEntity.externalId = job.slug;
        jobEntity.source = 'other';
        jobEntity.title = job.title;
        jobEntity.company = job.company_name;
        jobEntity.location = job.location || 'Not specified';
        jobEntity.isRemote = job.remote;
        jobEntity.description = this.stripHtml(job.description);
        jobEntity.descriptionHtml = job.description;
        jobEntity.jobType = this.mapJobTypes(job.job_types);
        jobEntity.url = job.url;
        jobEntity.applyUrl = job.url;
        jobEntity.keywords = job.tags;
        jobEntity.benefits = this.extractBenefits(job.description);
        jobEntity.isActive = true;
        jobEntity.postedAt = new Date(job.created_at * 1000);

        jobs.push(jobEntity);
      }

      return jobs;
    } catch (error) {
      console.error('Error fetching from Arbeitnow:', error);
      return [];
    }
  }

  /**
   * Fetch and save jobs from all sources
   */
  async fetchAndSaveJobs(
    options: { categories?: string[]; limit?: number } = {},
  ): Promise<{ total: number; new: number; sources: Record<string, number> }> {
    const { categories = ['software-dev'], limit = 50 } = options;
    const allJobs: JobListingEntity[] = [];
    const sourceCounts: Record<string, number> = {};

    for (const category of categories) {
      const remotiveJobs = await this.fetchFromRemotive(category, limit);
      allJobs.push(...remotiveJobs);
      sourceCounts.remotive =
        (sourceCounts.remotive || 0) + remotiveJobs.length;
    }

    let savedCount = 0;
    if (allJobs.length > 0) {
      const jobRepo = await this.db.open(JobListingEntity);
      for (const job of allJobs) {
        try {
          await jobRepo
            .createQueryBuilder()
            .insert()
            .into(JobListingEntity)
            .values(job)
            .orIgnore()
            .execute();
          savedCount++;
        } catch {
          // Job already exists, skip
        }
      }
    }

    return { total: allJobs.length, new: savedCount, sources: sourceCounts };
  }

  private async findExistingJob(
    externalId: string,
  ): Promise<JobListingEntity | null> {
    const jobRepo = await this.db.open(JobListingEntity);
    return jobRepo.findOne({ where: { externalId } });
  }

  private extractBenefits(description: string): string[] {
    const benefits: string[] = [];
    const lowerDesc = description.toLowerCase();

    const benefitKeywords = [
      { keyword: 'health insurance', benefit: 'Health Insurance' },
      { keyword: 'remote', benefit: 'Remote Work' },
      { keyword: 'flexible', benefit: 'Flexible Schedule' },
      { keyword: 'equity', benefit: 'Equity/Stock Options' },
      { keyword: 'bonus', benefit: 'Performance Bonus' },
      { keyword: 'pto', benefit: 'Paid Time Off' },
    ];

    for (const { keyword, benefit } of benefitKeywords) {
      if (lowerDesc.includes(keyword) && !benefits.includes(benefit)) {
        benefits.push(benefit);
      }
    }

    return benefits;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private mapJobType(
    type: string,
  ): 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote' {
    const lower = type.toLowerCase();
    if (lower.includes('full')) return 'full-time';
    if (lower.includes('part')) return 'part-time';
    if (lower.includes('contract')) return 'contract';
    if (lower.includes('intern')) return 'internship';
    return 'full-time';
  }

  private mapJobTypes(
    types: string[],
  ): 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote' {
    if (!types.length || !types[0]) return 'full-time';
    return this.mapJobType(types[0]);
  }

  private parseSalary(salary: string): {
    min?: number;
    max?: number;
    currency: string;
  } {
    const result: { min?: number; max?: number; currency: string } = {
      currency: 'USD',
    };

    if (salary.includes('€') || salary.toLowerCase().includes('eur')) {
      result.currency = 'EUR';
    } else if (salary.includes('£') || salary.toLowerCase().includes('gbp')) {
      result.currency = 'GBP';
    }

    const numbers = salary.match(/[\d,]+/g);
    if (numbers && numbers.length > 0) {
      const values = numbers.map((n) =>
        Number.parseInt(n.replace(/,/g, ''), 10),
      );
      const salaryValues = values.filter((v) => v > 1000);

      if (salaryValues.length >= 2) {
        result.min = Math.min(...salaryValues);
        result.max = Math.max(...salaryValues);
      } else if (salaryValues.length === 1) {
        result.min = salaryValues[0];
        result.max = salaryValues[0];
      }
    }

    return result;
  }
}

export const REMOTIVE_CATEGORIES = [
  'software-dev',
  'customer-support',
  'design',
  'marketing',
  'sales',
  'product',
  'business',
  'data',
  'devops',
  'finance',
  'hr',
  'qa',
  'writing',
  'all-others',
];
