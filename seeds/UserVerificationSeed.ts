import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { UserVerificationEntity } from '../apps/paladin/entities/UserVerificationEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';

const verificationTypes = ['email', 'otp', 'password_reset'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function seedUserVerifications(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const verificationRepo = await db.open(UserVerificationEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const verifications: UserVerificationEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const type = getRandomElement(verificationTypes);
    const expiresInHours = Math.floor(Math.random() * 24) + 1; // 1-24 hours
    const expiresAt = new Date(
      Date.now() + expiresInHours * 60 * 60 * 1000,
    );

    let identifier: string;
    let value: string;

    if (type === 'email') {
      identifier = user.email;
      value = random.nanoid(32);
    } else if (type === 'otp') {
      identifier = user.email;
      value = generateOTP();
    } else {
      // password_reset
      identifier = user.email;
      value = random.nanoid(64);
    }

    const verification = new UserVerificationEntity();
    verification.id = random.nanoid(15);
    verification.user = user;
    verification.identifier = identifier;
    verification.value = value;
    verification.expiresAt = expiresAt;

    verifications.push(verification);
  }

  await verificationRepo.save(verifications);
  return verifications.length;
}
