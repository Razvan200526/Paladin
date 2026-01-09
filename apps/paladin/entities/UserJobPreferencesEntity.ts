import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserEntity } from './UserEntity';

@Entity({
  name: 'user_job_preferences',
})
export class UserJobPreferencesEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @OneToOne('UserEntity', { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'desired_titles', type: 'text', array: true, default: '{}' })
  desiredTitles: string[];

  @Column({
    name: 'desired_locations',
    type: 'text',
    array: true,
    default: '{}',
  })
  desiredLocations: string[];

  @Column({ name: 'is_remote_preferred', type: 'boolean', default: false })
  isRemotePreferred: boolean;

  @Column({ name: 'is_hybrid_ok', type: 'boolean', default: true })
  isHybridOk: boolean;

  @Column({ name: 'is_onsite_ok', type: 'boolean', default: true })
  isOnsiteOk: boolean;

  @Column({ name: 'min_salary', type: 'int', nullable: true })
  minSalary?: number;

  @Column({ name: 'max_salary', type: 'int', nullable: true })
  maxSalary?: number;

  @Column({
    name: 'salary_currency',
    type: 'varchar',
    length: 3,
    default: 'USD',
  })
  salaryCurrency: string;

  @Column({
    name: 'job_types',
    type: 'text',
    array: true,
    default: '{full-time}',
  })
  jobTypes: string[];

  @Column({
    name: 'experience_levels',
    type: 'text',
    array: true,
    default: '{}',
  })
  experienceLevels: string[];

  @Column({
    name: 'preferred_industries',
    type: 'text',
    array: true,
    default: '{}',
  })
  preferredIndustries: string[];

  @Column({
    name: 'excluded_industries',
    type: 'text',
    array: true,
    default: '{}',
  })
  excludedIndustries: string[];

  @Column({
    name: 'preferred_companies',
    type: 'text',
    array: true,
    default: '{}',
  })
  preferredCompanies: string[];

  @Column({
    name: 'excluded_companies',
    type: 'text',
    array: true,
    default: '{}',
  })
  excludedCompanies: string[];

  @Column({ name: 'skills', type: 'text', array: true, default: '{}' })
  skills: string[];

  @Column({ name: 'notify_high_matches', type: 'boolean', default: true })
  notifyHighMatches: boolean;

  @Column({ name: 'notify_threshold', type: 'int', default: 70 })
  notifyThreshold: number;

  @Column({ name: 'notify_frequency', type: 'varchar', default: 'daily' })
  notifyFrequency: 'instant' | 'daily' | 'weekly';

  @Column({
    name: 'active_resume_id',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  activeResumeId?: string;

  @Column({ name: 'resume_skills', type: 'text', array: true, default: '{}' })
  resumeSkills: string[];

  @Column({ name: 'resume_keywords', type: 'text', array: true, default: '{}' })
  resumeKeywords: string[];

  @Column({ name: 'resume_embedding', type: 'jsonb', nullable: true })
  resumeEmbedding?: number[];

  @Column({ name: 'years_experience', type: 'int', nullable: true })
  yearsExperience?: number;

  @Column({ name: 'education_level', type: 'varchar', nullable: true })
  educationLevel?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
