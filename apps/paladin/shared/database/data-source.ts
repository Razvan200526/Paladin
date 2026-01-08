import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Initial1766947724851 } from '../../../../migrations/1766947724851-Initial';
import { Initial1767780233486 } from '../../../../migrations/1767780233486-Initial';
import { PrimaryEntities } from './Entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: Bun.env.APP_DATABASE_URL || Bun.env.APP_DATABASE_URL || '',
  synchronize: false,
  logging: true,
  entities: PrimaryEntities,
  migrations: [Initial1766947724851, Initial1767780233486],
  migrationsTableName: 'migrations',
});
