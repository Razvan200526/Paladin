import { random } from '../apps/common/utils';
import { PrimaryDatabase } from '../apps/paladin/shared/database/PrimaryDatabase';
import {
  NotificationEntity,
  type NotificationType,
  type NotificationPriority,
} from '../apps/paladin/entities/NotificationEntity';
import { UserEntity } from '../apps/paladin/entities/UserEntity';
import { ApplicationEntity } from '../apps/paladin/entities/ApplicationEntity';
import { ResumeEntity } from '../apps/paladin/entities/ResumeEntity';
import { CoverletterEntity } from '../apps/paladin/entities/CoverletterEntity';

const notificationTypes: NotificationType[] = [
  'application_status_change',
  'application_reminder',
  'interview_scheduled',
  'interview_reminder',
  'resume_analyzed',
  'coverletter_analyzed',
  'system',
  'achievement',
];

const priorities: NotificationPriority[] = ['low', 'normal', 'high', 'urgent'];

const titles = {
  application_status_change: 'Application Status Updated',
  application_reminder: 'Application Reminder',
  interview_scheduled: 'Interview Scheduled',
  interview_reminder: 'Interview Reminder',
  resume_analyzed: 'Resume Analysis Complete',
  coverletter_analyzed: 'Cover Letter Analysis Complete',
  system: 'System Notification',
  achievement: 'Achievement Unlocked',
};

const messages = {
  application_status_change: [
    'Your application status has been updated to Interviewing',
    'Your application has been moved to the next stage',
    'Your application status changed to Accepted',
    'Your application status changed to Rejected',
  ],
  application_reminder: [
    'You have an application that needs follow-up',
    "Don't forget to follow up on your application",
    'Your application is waiting for a response',
  ],
  interview_scheduled: [
    'Your interview has been scheduled for next week',
    'Interview confirmed for tomorrow at 2 PM',
    'Your interview is scheduled for this Friday',
  ],
  interview_reminder: [
    'Your interview is in 1 hour',
    'Reminder: Interview tomorrow at 10 AM',
    "Don't forget your interview today",
  ],
  resume_analyzed: [
    'Your resume has been analyzed and suggestions are available',
    'Resume analysis complete - check your recommendations',
    'New insights available for your resume',
  ],
  coverletter_analyzed: [
    'Your cover letter has been analyzed',
    'Cover letter analysis complete',
    'New suggestions available for your cover letter',
  ],
  system: [
    'System maintenance scheduled for tonight',
    'New features available',
    'Your account has been updated',
  ],
  achievement: [
    'Congratulations! You completed your profile',
    'Achievement: 10 applications submitted',
    'You unlocked a new badge',
  ],
};

const actionLabels = {
  application_status_change: 'View Application',
  application_reminder: 'View Application',
  interview_scheduled: 'View Details',
  interview_reminder: 'View Interview',
  resume_analyzed: 'View Suggestions',
  coverletter_analyzed: 'View Suggestions',
  system: 'Learn More',
  achievement: 'View Achievement',
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

export async function seedNotifications(
  db: PrimaryDatabase,
): Promise<number> {
  const userRepo = await db.open(UserEntity);
  const applicationRepo = await db.open(ApplicationEntity);
  const resumeRepo = await db.open(ResumeEntity);
  const coverletterRepo = await db.open(CoverletterEntity);
  const notificationRepo = await db.open(NotificationEntity);

  const users = await userRepo.find();
  if (users.length === 0) {
    throw new Error('No users found. Please seed users first.');
  }

  const applications = await applicationRepo.find({ relations: ['user'] });
  const resumes = await resumeRepo.find({ relations: ['user'] });
  const coverletters = await coverletterRepo.find({ relations: ['user'] });
  const notifications: NotificationEntity[] = [];

  for (let i = 0; i < 100; i++) {
    const user = getRandomElement(users);
    const type = getRandomElement(notificationTypes);
    const priority = getRandomElement(priorities);
    const isRead = Math.random() > 0.4; // 60% read

    const notification = new NotificationEntity();
    notification.id = random.nanoid(15);
    notification.user = user;
    notification.type = type;
    notification.title = titles[type];
    notification.message = getRandomElement(messages[type]);
    notification.priority = priority;
    notification.read = isRead;

    if (isRead) {
      notification.readAt = new Date(
        Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
      ); // Read within last 7 days
    }

    // Set resource based on type
    if (type.includes('application')) {
      const userApplications = applications.filter(
        (a) => a.user?.id === user.id,
      );
      if (userApplications.length > 0) {
        const application = getRandomElement(userApplications);
        notification.resourceType = 'application';
        notification.resourceId = application.id;
        notification.actionUrl = `/home/applications/${application.id}`;
      }
    } else if (type.includes('resume')) {
      const userResumes = resumes.filter((r) => r.user?.id === user.id);
      if (userResumes.length > 0) {
        const resume = getRandomElement(userResumes);
        notification.resourceType = 'resume';
        notification.resourceId = resume.id;
        notification.actionUrl = `/home/resources/resumes/${resume.id}`;
      }
    } else if (type.includes('coverletter')) {
      const userCoverletters = coverletters.filter(
        (c) => c.user?.id === user.id,
      );
      if (userCoverletters.length > 0) {
        const coverletter = getRandomElement(userCoverletters);
        notification.resourceType = 'coverletter';
        notification.resourceId = coverletter.id;
        notification.actionUrl = `/home/resources/coverletters/${coverletter.id}`;
      }
    }

    notification.actionLabel = actionLabels[type];

    // Add metadata for some notification types
    if (type === 'application_status_change') {
      notification.metadata = {
        oldStatus: 'Applied',
        newStatus: getRandomElement(['Interviewing', 'Accepted', 'Rejected']),
      };
    } else if (type === 'interview_scheduled') {
      notification.metadata = {
        interviewDate: new Date(
          Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        location: 'Virtual / Office',
      };
    }

    // Some notifications expire
    if (Math.random() > 0.7) {
      notification.expiresAt = new Date(
        Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      );
    }

    notification.createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    ); // Within last 30 days

    notifications.push(notification);
  }

  await notificationRepo.save(notifications);
  return notifications.length;
}
