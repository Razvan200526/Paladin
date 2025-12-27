import { getDataSourceForCLI } from '@razvan11/paladin';
import { PrimaryDatabase } from './PrimaryDatabase';

export const AppDataSource = getDataSourceForCLI(
  PrimaryDatabase,
  process.env.APP_DATABASE_URL || '',
);
