import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import { UserJobPreferencesEntity } from '../apps/paladin/entities/UserJobPreferencesEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';

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
  'UI Designer',
  'Marketing Manager',
  'Sales Representative',
  'Project Manager',
  'Business Analyst',
  'QA Engineer',
  'System Administrator',
  'Cloud Architect',
  'Security Engineer',
  'Mobile Developer',
  'Machine Learning Engineer',
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

const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media',
  'Real Estate',
  'Energy',
];

const companies = [
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
];

const skills = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'React',
  'Node.js',
  'AWS',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'GraphQL',
  'REST API',
  'Git',
  'CI/CD',
  'Agile',
  'Scrum',
  'Machine Learning',
  'Data Analysis',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function seedUserJobPreferences(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const resumeRepo = await db.open(ResumeEntity);
  const preferencesRepo = await db.open(UserJobPreferencesEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  // Get existing preferences to find users that already have preferences
  const existingPreferences = await preferencesRepo.find({
    relations: ['user'],
  });
  const usersWithPreferences = new Set(
    existingPreferences.map((pref) => pref.user.id),
  );

  // Filter out users that already have preferences
  const usersWithoutPreferences = users.filter(
    (user) => !usersWithPreferences.has(user.id),
  );

  if (usersWithoutPreferences.length === 0) {
    return 0; // All users already have preferences
  }

  const resumes = await resumeRepo.find({ relations: ['user'] });
  // Shuffle users to assign preferences randomly
  const shuffledUsers = [...usersWithoutPreferences].sort(
    () => Math.random() - 0.5,
  );
  const preferences: UserJobPreferencesEntity[] = [];

  // Create one preference per user (OneToOne relationship)
  for (let i = 0; i < Math.min(1000, shuffledUsers.length); i++) {
    const user = shuffledUsers[i]!;
    const userResumes = resumes.filter((r) => r.user?.id === user.id);
    const activeResume =
      userResumes.length > 0 && Math.random() > 0.3
        ? getRandomElement(userResumes)
        : undefined;

    const preference = new UserJobPreferencesEntity();
    preference.id = random.nanoid(15);
    preference.user = user;
    preference.desiredTitles = getRandomElements(jobTitles, 1, 5);
    preference.desiredLocations = getRandomElements(locations, 1, 5);
    preference.isRemotePreferred = Math.random() > 0.5;
    preference.isHybridOk = Math.random() > 0.3;
    preference.isOnsiteOk = Math.random() > 0.4;

    // Salary expectations
    if (Math.random() > 0.2) {
      const baseSalary = Math.floor(Math.random() * 100000) + 50000; // 50k - 150k
      preference.minSalary = baseSalary;
      preference.maxSalary = baseSalary + Math.floor(Math.random() * 50000);
      preference.salaryCurrency = getRandomElement(['USD', 'EUR', 'GBP']);
    }

    preference.jobTypes = getRandomElements(jobTypes, 1, 3);
    preference.experienceLevels = getRandomElements(experienceLevels, 1, 3);
    preference.preferredIndustries = getRandomElements(industries, 0, 5);
    preference.excludedIndustries = getRandomElements(industries, 0, 3);
    preference.preferredCompanies = getRandomElements(companies, 0, 5);
    preference.excludedCompanies = getRandomElements(companies, 0, 2);
    preference.skills = getRandomElements(skills, 5, 15);
    preference.notifyHighMatches = Math.random() > 0.2;
    preference.notifyThreshold = Math.floor(Math.random() * 30) + 70; // 70-100
    preference.notifyFrequency = getRandomElement([
      'instant',
      'daily',
      'weekly',
    ]);

    if (activeResume) {
      preference.activeResumeId = activeResume.id;
    }

    preference.resumeSkills = getRandomElements(skills, 3, 10);
    preference.resumeKeywords = getRandomElements(
      [
        'software',
        'development',
        'engineering',
        'programming',
        'coding',
        'design',
        'management',
        'leadership',
        'analytics',
        'strategy',
      ],
      3,
      8,
    );

    if (Math.random() > 0.5) {
      preference.yearsExperience = Math.floor(Math.random() * 20) + 1;
    }

    if (Math.random() > 0.5) {
      preference.educationLevel = getRandomElement([
        'High School',
        "Bachelor's Degree",
        "Master's Degree",
        'PhD',
      ]);
    }

    preference.isActive = Math.random() > 0.1; // 90% active

    preferences.push(preference);
  }

  await preferencesRepo.save(preferences);
  return preferences.length;
}

