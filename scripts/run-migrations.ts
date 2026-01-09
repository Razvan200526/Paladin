import 'reflect-metadata';
import { AppDataSource } from '../apps/paladin/shared/database/data-source';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.debug('Database connection established');

    console.debug('Running pending migrations...');
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.debug(' No pending migrations');
    } else {
      console.debug(` Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach((migration) => {
        console.debug(`   - ${migration.name}`);
      });
    }

    await AppDataSource.destroy();
    console.debug('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
