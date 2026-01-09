import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { ChatSessionEntity } from '../apps/paladin/entities/ChatSessionEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';
import { CoverletterEntity } from '../apps/paladin/entities/CoverletterEntity';

const resourceTypes = ['resume', 'coverletter'] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedChatSessions(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const resumeRepo = await db.open(ResumeEntity);
  const coverletterRepo = await db.open(CoverletterEntity);
  const sessionRepo = await db.open(ChatSessionEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const resumes = await resumeRepo.find({ relations: ['user'] });
  const coverletters = await coverletterRepo.find({ relations: ['user'] });
  const sessions: ChatSessionEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const resourceType = getRandomElement(resourceTypes);

    let resourceId: string;
    let resourceName: string;

    if (resourceType === 'resume') {
      const userResumes = resumes.filter((r) => r.user?.id === user.id);
      if (userResumes.length > 0) {
        const resume = getRandomElement(userResumes);
        resourceId = resume.id;
        resourceName = resume.name;
      } else {
        // Create a mock resume reference
        resourceId = random.nanoid(15);
        resourceName = 'My Resume';
      }
    } else {
      const userCoverletters = coverletters.filter(
        (c) => c.user?.id === user.id,
      );
      if (userCoverletters.length > 0) {
        const coverletter = getRandomElement(userCoverletters);
        resourceId = coverletter.id;
        resourceName = coverletter.name;
      } else {
        // Create a mock coverletter reference
        resourceId = random.nanoid(15);
        resourceName = 'My Cover Letter';
      }
    }

    const session = new ChatSessionEntity();
    session.id = random.nanoid(15);
    session.user = user;
    session.resourceType = resourceType;
    session.resourceId = resourceId;
    session.resourceName = resourceName;
    session.createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    ); // Within last 30 days
    session.updatedAt =
      Math.random() > 0.5
        ? new Date(
            session.createdAt.getTime() +
              Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
          )
        : null; // Updated within 7 days of creation

    sessions.push(session);
  }

  await sessionRepo.save(sessions);
  return sessions.length;
}
