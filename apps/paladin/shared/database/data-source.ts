import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Initial1767951915831 } from '../../../../migrations/1767951915831-Initial';
import { PrimaryEntities } from './Entities';
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: Bun.env.APP_DATABASE_URL || '',
  synchronize: false,
  logging: true,
  entities: PrimaryEntities,
  migrations: [Initial1767951915831],
  migrationsTableName: 'migrations',
  ssl: Bun.env.NODE_ENV === 'production',
});
