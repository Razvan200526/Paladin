/**
 * JobListingRepository
 * Handles CRUD operations for job listings
 */

import { PrimaryDatabase } from '@paladin/shared/database/PrimaryDatabase';
import { inject, repository } from '@razvan11/paladin';
import { JobListingEntity } from '../entities/JobListingEntity';

interface FindListingsOptions {
  search?: string;
  location?: string;
  jobType?: string;
  isRemote?: boolean;
  limit?: number;
  offset?: number;
}

@repository()
export class JobListingRepository {
  constructor(@inject(PrimaryDatabase) private db: PrimaryDatabase) {}

  async findAll(options?: FindListingsOptions): Promise<JobListingEntity[]> {
    const repo = await this.db.open(JobListingEntity);

    const queryBuilder = repo
      .createQueryBuilder('job')
      .where('job.isActive = :isActive', { isActive: true });

    if (options?.search) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.company ILIKE :search OR job.description ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options?.location) {
      queryBuilder.andWhere('job.location ILIKE :location', {
        location: `%${options.location}%`,
      });
    }

    if (options?.jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', {
        jobType: options.jobType,
      });
    }

    if (options?.isRemote !== undefined) {
      queryBuilder.andWhere('job.isRemote = :isRemote', {
        isRemote: options.isRemote,
      });
    }

    queryBuilder.orderBy('job.postedAt', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }

    if (options?.offset) {
      queryBuilder.skip(options.offset);
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<JobListingEntity | null> {
    const repo = await this.db.open(JobListingEntity);
    return repo.findOne({ where: { id } });
  }

  async countJobs(): Promise<number> {
    const repo = await this.db.open(JobListingEntity);
    return repo.count({ where: { isActive: true } });
  }

  async findByExternalId(externalId: string): Promise<JobListingEntity | null> {
    const repo = await this.db.open(JobListingEntity);
    return repo.findOne({ where: { externalId } });
  }
}
