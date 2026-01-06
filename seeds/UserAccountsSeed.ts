import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { UserAccountEntity } from '../apps/paladin/entities/UserAccountEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';

const providers = ['google', 'github', 'discord', 'credential'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedUserAccounts(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const accountRepo = await db.open(UserAccountEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  // Get existing accounts to find users that already have accounts
  const existingAccounts = await accountRepo.find({ relations: ['user'] });
  const usersWithAccounts = new Set(
    existingAccounts.map((acc) => acc.user.id),
  );

  // Filter out users that already have accounts
  const usersWithoutAccounts = users.filter(
    (user) => !usersWithAccounts.has(user.id),
  );

  if (usersWithoutAccounts.length === 0) {
    return 0; // All users already have accounts
  }

  // Shuffle users to assign accounts randomly
  const shuffledUsers = [...usersWithoutAccounts].sort(
    () => Math.random() - 0.5,
  );
  const accounts: UserAccountEntity[] = [];

  // Create one account per user (OneToOne relationship)
  for (let i = 0; i < Math.min(1000, shuffledUsers.length); i++) {
    const user = shuffledUsers[i]!;
    const providerId = getRandomElement(providers);
    const accountId =
      providerId === 'credential'
        ? user.email
        : `${providerId}_${random.nanoid(21)}`;

    const account = new UserAccountEntity();
    account.id = random.nanoid(15);
    account.user = user;
    account.providerId = providerId;
    account.accountId = accountId;

    // Only set password for credential provider
    if (providerId === 'credential') {
      account.password = `$2b$10$${random.nanoid(53)}`; // Mock bcrypt hash
    }

    // Set refresh token for OAuth providers
    if (providerId !== 'credential' && Math.random() > 0.3) {
      account.refreshToken = random.nanoid(100);
      account.expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ); // 30 days from now
    }

    // Set scope for OAuth providers
    if (providerId !== 'credential' && Math.random() > 0.5) {
      account.scope = 'openid profile email';
    }

    // Set ID token for OAuth providers
    if (providerId !== 'credential' && Math.random() > 0.5) {
      account.idToken = random.nanoid(200);
    }

    accounts.push(account);
  }

  await accountRepo.save(accounts);
  return accounts.length;
}

