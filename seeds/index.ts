import { color } from 'console-log-colors';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { seedUsers } from './UserSeeds';
import { seedUserAccounts } from './UserAccountsSeed';
import { seedUserSessions } from './UserSessionsSeed';
import { seedUserVerifications } from './UserVerificationSeed';
import { seedResumes } from './ResumeSeed';
import { seedCoverletters } from './CoverlettersSeed';
import { seedUserJobPreferences } from './UserJobPreferencesSeed';
import { seedJobListings } from './JobListingsSeed';
import { seedChatSessions } from './ChatSessionsSeed';
import { seedChatMessages } from './ChatMessagesSeed';
import { seedApplications } from './ApplicationSeed';
import { seedNotifications } from './NotificationSeed';
import { seedJobMatches } from './JobMatchesSeed';

interface SeedResult {
  name: string;
  success: boolean;
  count: number;
  error?: string;
}

async function main() {
  const dbUrl = Bun.env.APP_DATABASE_URL;

  if (!dbUrl) {
    console.error(
      color.red('✘ APP_DATABASE_URL environment variable is not set'),
    );
    process.exit(1);
  }

  console.log(color.cyan('Starting database seeding...\n'));

  const db = new PrimaryDatabase(dbUrl);
  const results: SeedResult[] = [];

  try {
    // Initialize database connection
    await db.getSource().initialize();
    console.log(color.green('✓ Database connection established\n'));

    // Execute seeds in dependency order
    const seeds = [
      { name: 'Users', fn: seedUsers },
      { name: 'User Accounts', fn: seedUserAccounts },
      { name: 'User Sessions', fn: seedUserSessions },
      { name: 'User Verifications', fn: seedUserVerifications },
      { name: 'Resumes', fn: seedResumes },
      { name: 'Coverletters', fn: seedCoverletters },
      { name: 'User Job Preferences', fn: seedUserJobPreferences },
      { name: 'Job Listings', fn: seedJobListings },
      { name: 'Chat Sessions', fn: seedChatSessions },
      { name: 'Chat Messages', fn: seedChatMessages },
      { name: 'Applications', fn: seedApplications },
      { name: 'Notifications', fn: seedNotifications },
      { name: 'Job Matches', fn: seedJobMatches },
    ];

    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      const progress = `[${i + 1}/${seeds.length}]`;

      try {
        console.log(
          color.yellow(`${progress} Seeding ${seed.name}...`),
        );
        const count = await seed.fn(db);
        results.push({
          name: seed.name,
          success: true,
          count,
        });
        console.log(
          color.green(
            `  ✓ ${seed.name}: ${count} entries created\n`,
          ),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        results.push({
          name: seed.name,
          success: false,
          count: 0,
          error: errorMessage,
        });
        console.log(
          color.red(`  ✘ ${seed.name}: ${errorMessage}\n`),
        );
      }
    }

    // Print summary
    console.log(color.cyan('\n📊 Seeding Summary:\n'));
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (successful.length > 0) {
      console.log(color.green('✓ Successful:'));
      successful.forEach((r) => {
        console.log(`  • ${r.name}: ${r.count} entries`);
      });
      console.log();
    }

    if (failed.length > 0) {
      console.log(color.red('✘ Failed:'));
      failed.forEach((r) => {
        console.log(`  • ${r.name}: ${r.error}`);
      });
      console.log();
    }

    const totalCreated = successful.reduce((sum, r) => sum + r.count, 0);
    console.log(
      color.cyan(`Total entries created: ${totalCreated}`),
    );
  } catch (error) {
    console.error(
      color.red('✘ Fatal error during seeding:'),
      error,
    );
    process.exit(1);
  } finally {
    await db.close();
    console.log(color.green('\n✓ Database connection closed'));
  }
}

main().catch((error) => {
  console.error(color.red('✘ Unhandled error:'), error);
  process.exit(1);
});
