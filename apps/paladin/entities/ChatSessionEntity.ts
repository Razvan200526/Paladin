import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessageEntity } from './ChatMessageEntity';
import type { UserEntity } from './UserEntity';

@Entity('chat_sessions')
export class ChatSessionEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @ManyToOne('UserEntity', 'chatSessions')
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'resource_type',
    type: 'enum',
    enum: ['resume', 'coverletter'],
  })
  resourceType: 'resume' | 'coverletter';

  @Column({
    name: 'resource_id',
    type: 'varchar',
    length: 15,
  })
  resourceId: string;

  @Column({
    name: 'resource_name',
    type: 'varchar',
    length: 255,
  })
  resourceName: string;

  @OneToMany(
    () => ChatMessageEntity,
    (message) => message.chatSession,
  )
  messages: ChatMessageEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date | null;
}
