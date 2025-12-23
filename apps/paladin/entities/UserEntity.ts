import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  type ApplicationEntity,
  type ChatSessionEntity,
  CoverletterEntity,
  ResumeEntity,
  type UserAccountEntity,
  type UserSessionEntity,
} from './index';

@Entity({
  name: 'users',
})
@Index(['email'], { unique: true })
export class UserEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @OneToMany(
    () => ResumeEntity,
    (resume: any) => resume.user,
  )
  resumes: ResumeEntity[];

  @OneToMany(
    () => CoverletterEntity,
    (coverletter: any) => coverletter.user,
  )
  coverletters: CoverletterEntity[];

  @OneToMany('ChatSessionEntity', 'user')
  chatSessions: ChatSessionEntity[];

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'image', type: 'text', nullable: true })
  image?: string;

  @OneToMany('UserSessionEntity', 'user')
  sessions: UserSessionEntity[];

  @OneToMany('ApplicationEntity', 'user')
  applications: ApplicationEntity[];

  @OneToOne('UserAccountEntity', 'user')
  account: UserAccountEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Column({ name: 'locked_at', type: 'timestamptz', nullable: true })
  lockedAt?: Date | null;

  @Column({ name: 'blocked_at', type: 'timestamptz', nullable: true })
  blockedAt?: Date | null;
}
