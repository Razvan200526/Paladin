import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobListingEntity } from './JobListingEntity';
import { ResumeEntity } from './ResumeEntity';
import type { UserEntity } from './UserEntity';

export type MatchStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'dismissed';

@Entity({
  name: 'job_matches',
})
export class JobMatchEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @ManyToOne('UserEntity', { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => JobListingEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: JobListingEntity;

  @ManyToOne(() => ResumeEntity, { nullable: true })
  @JoinColumn({ name: 'resume_id' })
  resume?: ResumeEntity;

  @Column({
    name: 'compatibility_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  compatibilityScore: number;

  @Column({
    name: 'skills_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  skillsScore: number;

  @Column({
    name: 'experience_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  experienceScore: number;

  @Column({
    name: 'education_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  educationScore: number;

  @Column({
    name: 'keywords_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  keywordsScore: number;

  @Column({
    name: 'semantic_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  semanticScore: number;

  @Column({ name: 'matched_skills', type: 'text', array: true, default: '{}' })
  matchedSkills: string[];

  @Column({ name: 'missing_skills', type: 'text', array: true, default: '{}' })
  missingSkills: string[];

  @Column({
    name: 'matched_keywords',
    type: 'text',
    array: true,
    default: '{}',
  })
  matchedKeywords: string[];

  @Column({
    name: 'missing_keywords',
    type: 'text',
    array: true,
    default: '{}',
  })
  missingKeywords: string[];

  @Column({
    name: 'improvement_suggestions',
    type: 'text',
    array: true,
    default: '{}',
  })
  improvementSuggestions: string[];

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['new', 'viewed', 'saved', 'applied', 'dismissed'],
    default: 'new',
  })
  status: MatchStatus;

  @Column({ name: 'is_notified', type: 'boolean', default: false })
  isNotified: boolean;

  @Column({ name: 'viewed_at', type: 'timestamptz', nullable: true })
  viewedAt?: Date;

  @Column({ name: 'saved_at', type: 'timestamptz', nullable: true })
  savedAt?: Date;

  @Column({ name: 'applied_at', type: 'timestamptz', nullable: true })
  appliedAt?: Date;

  @Column({ name: 'dismissed_at', type: 'timestamptz', nullable: true })
  dismissedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
