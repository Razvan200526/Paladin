import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import {
  JobListingEntity,
  type JobSource,
  type JobType,
  type ExperienceLevel,
} from '../apps/paladin/entities/JobListingEntity';

const jobTitles = [
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
  'Data Engineer',
  'Site Reliability Engineer',
  'Technical Lead',
  'Engineering Manager',
  'Software Architect',
  'Solutions Architect',
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
  'Intel',
  'NVIDIA',
  'AMD',
  'Cisco',
  'VMware',
  'Red Hat',
  'MongoDB',
  'Elastic',
  'Databricks',
  'Snowflake',
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
  'TensorFlow',
  'PyTorch',
  'Redis',
  'Elasticsearch',
  'Kafka',
];

const benefits = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  '401(k) Matching',
  'Stock Options',
  'Remote Work',
  'Flexible Hours',
  'Unlimited PTO',
  'Professional Development',
  'Gym Membership',
  'Free Meals',
  'Transportation',
  'Childcare',
  'Wellness Program',
];

const sources: JobSource[] = ['linkedin', 'indeed', 'glassdoor', 'manual', 'other'];
const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'lead', 'executive'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function getRandomElements<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateJobDescription(title: string, company: string): string {
  return `We are looking for a ${title} to join our team at ${company}.

Responsibilities:
- Design and develop scalable software solutions
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Contribute to technical documentation

Requirements:
- Bachelor's degree in Computer Science or related field
- Strong problem-solving skills
- Excellent communication skills
- Experience with modern development practices

This is an exciting opportunity to work with cutting-edge technology and make a real impact.`;
}

export async function seedJobListings(
  db: PrimaryDatabase,
): Promise<number> {
  const repository = await db.open(JobListingEntity);
  const listings: JobListingEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const title = getRandomElement(jobTitles);
    const company = getRandomElement(companies);
    const location = getRandomElement(locations);
    const source = getRandomElement(sources);
    const jobType = getRandomElement(jobTypes);
    const experienceLevel = Math.random() > 0.2 ? getRandomElement(experienceLevels) : undefined;
    const isRemote = location === 'Remote' || Math.random() > 0.6;

    const listing = new JobListingEntity();
    listing.id = random.nanoid(15);
    listing.externalId = source !== 'manual' ? random.nanoid(20) : undefined;
    listing.source = source;
    listing.title = title;
    listing.company = company;
    listing.companyLogo = `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`;
    listing.location = location;
    listing.isRemote = isRemote;
    listing.description = generateJobDescription(title, company);
    listing.descriptionHtml = `<p>${generateJobDescription(title, company).replace(/\n/g, '</p><p>')}</p>`;
    listing.jobType = jobType;
    listing.experienceLevel = experienceLevel;

    // Salary range
    if (Math.random() > 0.3) {
      const baseSalary = Math.floor(Math.random() * 150000) + 50000; // 50k - 200k
      listing.salaryMin = baseSalary;
      listing.salaryMax = baseSalary + Math.floor(Math.random() * 50000);
      listing.salaryCurrency = getRandomElement(['USD', 'EUR', 'GBP']);
    }

    listing.url = `https://${source}.com/jobs/${random.nanoid(15)}`;
    listing.applyUrl = `https://${source}.com/apply/${random.nanoid(15)}`;
    listing.requiredSkills = getRandomElements(skills, 3, 8);
    listing.preferredSkills = getRandomElements(skills, 0, 5);
    listing.keywords = getRandomElements(
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
      listing.yearsExperienceMin = Math.floor(Math.random() * 5) + 1;
      listing.yearsExperienceMax = listing.yearsExperienceMin + Math.floor(Math.random() * 10) + 5;
    }

    if (Math.random() > 0.5) {
      listing.educationRequirement = getRandomElement([
        "Bachelor's Degree",
        "Master's Degree",
        'PhD',
        'High School Diploma',
      ]);
    }

    listing.benefits = getRandomElements(benefits, 3, 8);
    listing.isActive = Math.random() > 0.1; // 90% active

    // Expiration date (30-90 days from now)
    if (Math.random() > 0.3) {
      listing.expiresAt = new Date(
        Date.now() + (Math.floor(Math.random() * 60) + 30) * 24 * 60 * 60 * 1000,
      );
    }

    // Posted date (0-30 days ago)
    listing.postedAt = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    );

    listings.push(listing);
  }

  await repository.save(listings);
  return listings.length;
}
