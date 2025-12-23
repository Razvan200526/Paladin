import type { ResourceReadyState } from '@shared/types';

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
