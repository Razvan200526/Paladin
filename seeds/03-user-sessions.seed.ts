import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { UserSessionEntity } from '../apps/paladin/entities/UserSessionEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
];

const ipAddresses = [
  '192.168.1.100',
  '10.0.0.50',
  '172.16.0.25',
  '203.0.113.42',
  '198.51.100.15',
  '192.0.2.10',
  '::1',
  '2001:db8::1',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function generateRandomIP(): string {
  if (Math.random() > 0.8) {
    // IPv6
    return `2001:db8::${Math.floor(Math.random() * 65535)}`;
  }
  // IPv4
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

export async function seedUserSessions(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const sessionRepo = await db.open(UserSessionEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const sessions: UserSessionEntity[] = [];

  for (let i = 0; i < 1000; i++) {
    const user = getRandomElement(users);
    const expiresInDays = Math.floor(Math.random() * 30) + 1; // 1-30 days
    const expiresAt = new Date(
      Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    );

    const session = new UserSessionEntity();
    session.id = random.nanoid(15);
    session.user = user;
    session.token = random.nanoid(128);
    session.expiresAt = expiresAt;
    session.ipAddress =
      Math.random() > 0.1 ? generateRandomIP() : undefined;
    session.userAgent =
      Math.random() > 0.1 ? getRandomElement(userAgents) : undefined;

    sessions.push(session);
  }

  await sessionRepo.save(sessions);
  return sessions.length;
}

