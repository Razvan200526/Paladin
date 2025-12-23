import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

export type NotificationType =
  | 'application_status_change'
  | 'application_reminder'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'resume_analyzed'
  | 'coverletter_analyzed'
  | 'system'
  | 'achievement';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

@Entity({
  name: 'notifications',
})
@Index(['user', 'read'])
@Index(['user', 'createdAt'])
export class NotificationEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'type',
    type: 'enum',
    enum: [
      'application_status_change',
      'application_reminder',
      'interview_scheduled',
      'interview_reminder',
      'resume_analyzed',
      'coverletter_analyzed',
      'system',
      'achievement',
    ],
  })
  type: NotificationType;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Column({
    name: 'priority',
    type: 'enum',
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  })
  priority: NotificationPriority;

  @Column({ name: 'read', type: 'boolean', default: false })
  read: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt?: Date | null;

  @Column({ name: 'action_url', type: 'varchar', nullable: true })
  actionUrl?: string | null;

  @Column({ name: 'action_label', type: 'varchar', nullable: true })
  actionLabel?: string | null;

  @Column({ name: 'resource_type', type: 'varchar', nullable: true })
  resourceType?: 'application' | 'resume' | 'coverletter' | 'interview' | null;

  @Column({ name: 'resource_id', type: 'varchar', length: 15, nullable: true })
  resourceId?: string | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any> | null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
