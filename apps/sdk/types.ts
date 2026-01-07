import type { ResourceReadyState } from '@common/types';

export type SendMailParams = {
  to: string[];
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
};

export interface Mailer {
  send(params: SendMailParams): Promise<void>;
}

export type UserType = {
  id: string;
  email: string;
  password: string;
  image: string;
  name: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type ResponseType<T = any> = {
  data: T;
  message: string | null;
  success: boolean;
  status: number;
  isClientError: boolean;
  isServerError: boolean;
  isNotFound: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
  debug: boolean;
  app: {
    url: string;
  };
};
export type SocketChannelNameType = `${string}:${string}`;
export type SocketPayloadKeyType = `${string}:${string}`;

export type SocketResponseType<T = any> = {
  id?: string;
  key?: SocketPayloadKeyType;
  channelName: SocketChannelNameType;
  data: T;
  message: string | null;
  success: boolean;
  status: number;
  isClientError: boolean;
  isServerError: boolean;
  isNotFound: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
  isLocal: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  debug: boolean;
  app: {
    url: string;
  };
};
export type ResumeChatResponseType = {
  pages: number[];
  text: string;
  status: 'progress' | 'completed';
};

export type UserAccountType = {
  id: string;
  user: UserType;
  image: string;
  providerId: string;
  accountId: string;
  password?: string;
  accessToken?: string;
  accessTokenExpiresAt?: Date;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  expiresAt?: Date;
  scope?: string;
  idToken?: string;
  createdAt: Date;
};

export type UserShareType = {
  id: string;
  sharedUser: UserType;
  user: UserType;
  createdAt: Date;
};

export type UserSessionType = {
  id: string;
  user: UserType;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
};

export type UserVerificationType = {
  id: string;
  user: UserType;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
};

export type UserTypeType = {
  id: string;
  name: string;
};

export type ResumeType = {
  id: string;
  name: string;
  url: string;
  isReady: boolean;
  state: ResourceReadyState;
  createdAt: Date;
  uploadedAt: Date;
};

/**
 * Resume Builder contact information
 */
export type ResumeBuilderContactInfo = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
};

/**
 * Resume Builder experience entry
 */
export type ResumeBuilderExperienceEntry = {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
};

/**
 * Resume Builder education entry
 */
export type ResumeBuilderEducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description: string;
};

/**
 * Resume Builder skill category
 */
export type ResumeBuilderSkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

/**
 * Resume Builder project entry
 */
export type ResumeBuilderProjectEntry = {
  id: string;
  name: string;
  url?: string;
  technologies: string[];
  description: string;
};

/**
 * Resume Builder custom section
 */
export type ResumeBuilderCustomSection = {
  id: string;
  title: string;
  content: string;
};

/**
 * Resume Builder data structure
 */
export type ResumeBuilderData = {
  contact: ResumeBuilderContactInfo;
  summary?: string;
  experience: ResumeBuilderExperienceEntry[];
  education: ResumeBuilderEducationEntry[];
  skills: ResumeBuilderSkillCategory[];
  projects: ResumeBuilderProjectEntry[];
  customSections: ResumeBuilderCustomSection[];
};

/**
 * Resume Builder type - for resumes created with the builder
 */
export type ResumeBuilderType = {
  id: string;
  name: string;
  templateId: string;
  data: ResumeBuilderData;
  status: 'draft' | 'published';
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
  };
};

export type CoverLetterType = {
  id: string;
  name: string;
  url: string;
  user: UserType;
  isReady: boolean;
  state: ResourceReadyState;
  uploadedAt: Date;
};

type ApplicationStatusType =
  | 'Applied'
  | 'Interviewing'
  | 'Accepted'
  | 'Rejected';

export type ApplicationType = {
  id: string;
  employer: string;
  jobTitle: string;
  jobUrl?: string;
  salaryRange?: string;
  currency?: string;
  contact?: string;
  resume?: ResumeType;
  coverletter?: CoverLetterType;
  comments: string[];
  suggestions: string[];
  platform: 'Linkedin' | 'Glassdoor' | 'Other';
  location: string;
  status: ApplicationStatusType;
  updatedAt: Date;
  createdAt: Date;
};

export type CreateApplicationType = {
  userId: string;
  data: {
    employer: string;
    jobTitle: string;
    location: string;
    jobUrl?: string;
    salaryRange?: string;
    currency?: string;
    contact?: string;
    platform: string;
    status: ApplicationStatusType;
    resume?: ResumeType;
    coverletter?: CoverLetterType;
    resumeId?: string;
    coverletterId?: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
