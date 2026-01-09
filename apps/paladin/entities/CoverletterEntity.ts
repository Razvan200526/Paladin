import { random } from '@common/utils';
import type { UserEntity } from '@paladin/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('coverletter')
export class CoverletterEntity {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  id: string = random.nanoid(15);

  @ManyToOne('UserEntity', 'coverletters')
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'text' })
  url: string; // The R2 URL or key

  @Column({ type: 'varchar', nullable: true })
  filetype: string;

  @Column({ type: 'int', nullable: true })
  filesize: number;

  @Column({ enum: ['ready', 'processing', 'failed'], default: 'processing' })
  state: 'ready' | 'processing' | 'failed';

  @CreateDateColumn()
  uploadedAt: Date;
}
