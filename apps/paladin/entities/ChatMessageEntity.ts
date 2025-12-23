import { random } from '@common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ChatSessionEntity } from './ChatSessionEntity';

@Entity({
  name: 'chat_messages',
})
export class ChatMessageEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @ManyToOne(
    () => ChatSessionEntity,
    (session) => session.messages,
  )
  @JoinColumn({ name: 'chat_session_id' })
  chatSession: ChatSessionEntity;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['user', 'ai'],
  })
  sender: 'user' | 'ai';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  timestamp: Date;
}
