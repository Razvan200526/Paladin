import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RandomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
