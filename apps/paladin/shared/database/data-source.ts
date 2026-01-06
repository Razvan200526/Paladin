import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PrimaryEntities } from './Entities';
import { Initial1766947724851 } from '../../../../migrations/1766947724851-Initial';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.APP_DATABASE_URL || Bun.env.APP_DATABASE_URL || '',
  synchronize: false,
  logging: true,
  entities: PrimaryEntities,
  migrations: [Initial1766947724851],
  migrationsTableName: 'migrations',
});
