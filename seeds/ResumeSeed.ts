import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';

const resumeNames = [
  'Software Engineer Resume',
  'Senior Developer CV',
  'Full Stack Engineer Resume',
  'Frontend Developer Resume',
  'Backend Developer CV',
  'DevOps Engineer Resume',
  'Product Manager Resume',
  'Data Scientist CV',
  'UX Designer Resume',
  'Marketing Manager CV',
  'Sales Representative Resume',
  'Project Manager CV',
  'Business Analyst Resume',
  'QA Engineer CV',
  'System Administrator Resume',
];

const fileTypes = ['application/pdf', 'application/msword', 'text/plain'];
const states: ('processing' | 'ready' | 'failed')[] = ['processing', 'ready', 'failed'];

function getRandomElement<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedResumes(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const resumeRepo = await db.open(ResumeEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const resumes: ResumeEntity[] = [];

  for (let i = 0; i < 1000; i++) {
    const user = getRandomElement(users);
    const name = getRandomElement(resumeNames);
    const filetype = getRandomElement(fileTypes);
    const extension = filetype === 'application/pdf' ? 'pdf' : filetype === 'application/msword' ? 'doc' : 'txt';
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${random.nanoid(8)}.${extension}`;
    const state = getRandomElement(states);
    const filesize = Math.floor(Math.random() * 2000000) + 50000; // 50KB - 2MB

    const resume = new ResumeEntity();
    resume.id = random.nanoid(15);
    resume.user = user;
    resume.name = name;
    resume.filename = filename;
    resume.url = `https://storage.example.com/resumes/${user.id}/${filename}`;
    resume.filetype = filetype;
    resume.filesize = filesize;
    resume.state = state;
    resume.uploadedAt = new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
    ); // Within last 90 days

    resumes.push(resume);
  }

  await resumeRepo.save(resumes);
  return resumes.length;
}

