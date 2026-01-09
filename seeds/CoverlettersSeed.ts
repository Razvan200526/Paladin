import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { CoverletterEntity } from '../apps/paladin/entities/CoverletterEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';

const coverletterNames = [
  'Software Engineer Cover Letter',
  'Senior Developer Cover Letter',
  'Full Stack Engineer Cover Letter',
  'Frontend Developer Cover Letter',
  'Backend Developer Cover Letter',
  'DevOps Engineer Cover Letter',
  'Product Manager Cover Letter',
  'Data Scientist Cover Letter',
  'UX Designer Cover Letter',
  'Marketing Manager Cover Letter',
  'Sales Representative Cover Letter',
  'Project Manager Cover Letter',
  'Business Analyst Cover Letter',
  'QA Engineer Cover Letter',
  'System Administrator Cover Letter',
];

const fileTypes = ['application/pdf', 'application/msword', 'text/plain'];
const states: ('ready' | 'processing' | 'failed')[] = ['ready', 'processing', 'failed'];

function getRandomElement<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedCoverletters(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const coverletterRepo = await db.open(CoverletterEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const coverletters: CoverletterEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const name = getRandomElement(coverletterNames);
    const filetype = getRandomElement(fileTypes);
    const extension = filetype === 'application/pdf' ? 'pdf' : filetype === 'application/msword' ? 'doc' : 'txt';
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${random.nanoid(8)}.${extension}`;
    const state = getRandomElement(states);
    const filesize = Math.floor(Math.random() * 500000) + 10000; // 10KB - 500KB

    const coverletter = new CoverletterEntity();
    coverletter.id = random.nanoid(15);
    coverletter.user = user;
    coverletter.name = name;
    coverletter.filename = filename;
    coverletter.url = `https://storage.example.com/coverletters/${user.id}/${filename}`;
    coverletter.filetype = filetype;
    coverletter.filesize = filesize;
    coverletter.state = state;
    coverletter.uploadedAt = new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
    ); // Within last 90 days

    coverletters.push(coverletter);
  }

  await coverletterRepo.save(coverletters);
  return coverletters.length;
}
