import { random } from '@common/utils';
import type { UserEntity } from '@paladin/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Interface representing contact information in a resume
 */
export interface ResumeContactInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

/**
 * Interface representing an experience entry
 */
export interface ResumeExperienceEntry {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

/**
 * Interface representing an education entry
 */
export interface ResumeEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description: string;
}

/**
 * Interface representing a skill category
 */
export interface ResumeSkillCategory {
  id: string;
  name: string;
  skills: string[];
}

/**
 * Interface representing a project entry
 */
export interface ResumeProjectEntry {
  id: string;
  name: string;
  url?: string;
  technologies: string[];
  description: string;
}

/**
 * Interface representing a custom section
 */
export interface ResumeCustomSection {
  id: string;
  title: string;
  content: string;
}

/**
 * Full resume builder data structure
 */
export interface ResumeBuilderData {
  contact: ResumeContactInfo;
  summary?: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: ResumeSkillCategory[];
  projects: ResumeProjectEntry[];
  customSections: ResumeCustomSection[];
}

@Entity('resume_builders')
export class ResumeBuilderEntity {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  id: string = random.nanoid(15);

  @ManyToOne('UserEntity', 'resumeBuilders')
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'classic' })
  templateId: string;

  @Column({ type: 'jsonb' })
  data: ResumeBuilderData;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: 'draft' | 'published';

  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
