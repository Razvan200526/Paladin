import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export type JobSource =
  | 'linkedin'
  | 'indeed'
  | 'glassdoor'
  | 'manual'
  | 'other';
export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

@Entity({
  name: 'job_listings',
})
@Index(['source', 'externalId'], { unique: true })
@Index(['location'])
@Index(['createdAt'])
@Index(['expiresAt'])
export class JobListingEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  externalId?: string;

  @Column({
    name: 'source',
    type: 'enum',
    enum: ['linkedin', 'indeed', 'glassdoor', 'manual', 'other'],
    default: 'other',
  })
  source: JobSource;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'company', type: 'varchar', length: 255 })
  company: string;

  @Column({ name: 'company_logo', type: 'text', nullable: true })
  companyLogo?: string;

  @Column({ name: 'location', type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'is_remote', type: 'boolean', default: false })
  isRemote: boolean;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'description_html', type: 'text', nullable: true })
  descriptionHtml?: string;

  @Column({
    name: 'job_type',
    type: 'enum',
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time',
  })
  jobType: JobType;

  @Column({
    name: 'experience_level',
    type: 'enum',
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    nullable: true,
  })
  experienceLevel?: ExperienceLevel;

  @Column({ name: 'salary_min', type: 'int', nullable: true })
  salaryMin?: number;

  @Column({ name: 'salary_max', type: 'int', nullable: true })
  salaryMax?: number;

  @Column({
    name: 'salary_currency',
    type: 'varchar',
    length: 3,
    default: 'USD',
  })
  salaryCurrency: string;

  @Column({ name: 'url', type: 'text' })
  url: string;

  @Column({ name: 'apply_url', type: 'text', nullable: true })
  applyUrl?: string;

  @Column({ name: 'required_skills', type: 'text', array: true, default: '{}' })
  requiredSkills: string[];

  @Column({
    name: 'preferred_skills',
    type: 'text',
    array: true,
    default: '{}',
  })
  preferredSkills: string[];

  @Column({ name: 'keywords', type: 'text', array: true, default: '{}' })
  keywords: string[];

  @Column({ name: 'embedding', type: 'jsonb', nullable: true })
  embedding?: number[];

  @Column({ name: 'years_experience_min', type: 'int', nullable: true })
  yearsExperienceMin?: number;

  @Column({ name: 'years_experience_max', type: 'int', nullable: true })
  yearsExperienceMax?: number;

  @Column({ name: 'education_requirement', type: 'varchar', nullable: true })
  educationRequirement?: string;

  @Column({ name: 'benefits', type: 'text', array: true, default: '{}' })
  benefits: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
