import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { ApplicationEntity } from '../apps/paladin/entities/ApplicationEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';
import { CoverletterEntity } from '../apps/paladin/entities/CoverletterEntity';

const jobTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'QA Engineer',
  'System Administrator',
];

const employers = [
  'Google',
  'Microsoft',
  'Apple',
  'Amazon',
  'Meta',
  'Netflix',
  'Tesla',
  'Uber',
  'Airbnb',
  'Stripe',
  'Shopify',
  'Salesforce',
  'Oracle',
  'IBM',
  'Adobe',
  'Intel',
  'NVIDIA',
  'AMD',
  'Cisco',
  'VMware',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Denver, CO',
  'Remote',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Amsterdam, Netherlands',
  'Dublin, Ireland',
];

const platforms = ['Linkedin', 'Glassdoor', 'Other'] as const;
const statuses = ['Applied', 'Interviewing', 'Accepted', 'Rejected'] as const;
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const comments = [
  'Applied through company website',
  'Referred by a friend',
  'Found on LinkedIn',
  'Recruiter reached out',
  'Applied after job fair',
  'Follow-up email sent',
  'Phone screening scheduled',
  'Technical interview completed',
  'Waiting for response',
  'Offer received',
];

const suggestions = [
  'Update resume with latest projects',
  'Prepare for technical interview',
  'Research company culture',
  'Practice common interview questions',
  'Update LinkedIn profile',
  'Prepare questions for interviewer',
  'Review job description again',
  'Connect with employees on LinkedIn',
  'Prepare portfolio examples',
  'Practice coding challenges',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}


export async function seedApplications(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const resumeRepo = await db.open(ResumeEntity);
  const coverletterRepo = await db.open(CoverletterEntity);
  const applicationRepo = await db.open(ApplicationEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const resumes = await resumeRepo.find({ relations: ['user'] });
  const coverletters = await coverletterRepo.find({ relations: ['user'] });
  const applications: ApplicationEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const userResumes = resumes.filter((r) => r.user?.id === user.id);
    const userCoverletters = coverletters.filter(
      (c) => c.user?.id === user.id,
    );

    const application = new ApplicationEntity();
    application.id = random.nanoid(15);
    application.user = user;
    application.resume =
      userResumes.length > 0 && Math.random() > 0.3
        ? getRandomElement(userResumes)
        : undefined;
    application.coverletter =
      userCoverletters.length > 0 && Math.random() > 0.4
        ? getRandomElement(userCoverletters)
        : undefined;
    application.employer = getRandomElement(employers);
    application.jobTitle = getRandomElement(jobTitles);
    application.jobUrl =
      Math.random() > 0.2
        ? `https://${getRandomElement(['linkedin.com', 'glassdoor.com', 'company.com'])}/jobs/${random.nanoid(15)}`
        : null;
    application.location = getRandomElement(locations);

    // Salary range
    if (Math.random() > 0.4) {
      const baseSalary = Math.floor(Math.random() * 100000) + 50000; // 50k - 150k
      application.salaryRange = `$${baseSalary.toLocaleString()} - $${(baseSalary + Math.floor(Math.random() * 50000)).toLocaleString()}`;
      application.currency = getRandomElement(currencies);
    }

    // Contact person
    if (Math.random() > 0.5) {
      application.contact = `${getRandomElement(['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily'])} ${getRandomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}`;
    }

    application.platform = getRandomElement(platforms);
    application.status = getRandomElement(statuses);
    application.comments = getRandomElements(comments, 0, 3);
    application.suggestions = getRandomElements(suggestions, 0, 5);

    // Set dates based on status
    const daysAgo = Math.floor(Math.random() * 90); // Within last 90 days
    application.createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    );

    if (application.status !== 'Applied') {
      application.updatedAt = new Date(
        application.createdAt.getTime() +
          Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      );
    }

    // Some applications might be locked or blocked
    if (Math.random() > 0.9) {
      application.lockedAt = new Date();
    }
    if (Math.random() > 0.95) {
      application.blockedAt = new Date();
    }

    applications.push(application);
  }

  await applicationRepo.save(applications);
  return applications.length;
}
