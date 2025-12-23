/**
 * Validation Models
 * Zod schemas migrated from easyres for request validation
 */
import * as z from 'zod';

// Application Models
export const CreateApplicationModel = z.object({
  userId: z.string().length(15),
  data: z.object({
    employer: z.string().min(2).max(100),
    jobTitle: z.string().min(2).max(100),
    location: z.string().min(1),
    jobUrl: z.string().url().optional(),
    salaryRange: z.string().optional(),
    currency: z.string().length(3).optional(),
    contact: z.string().optional(),
    platform: z.enum(['Linkedin', 'Glassdoor', 'Other']),
    status: z.enum(['Applied', 'Interviewing', 'Accepted', 'Rejected']),
    resumeId: z.string().length(15).optional(),
    coverletterId: z.string().length(15).optional(),
  }),
});

export const UpdateApplicationModel = z.object({
  employer: z.string().min(2).max(100).optional(),
  jobTitle: z.string().min(2).max(100).optional(),
  location: z.string().min(1).optional(),
  jobUrl: z.string().optional().nullable(),
  salaryRange: z.string().optional(),
  currency: z.string().length(3).optional(),
  contact: z.string().optional().nullable(),
  platform: z.enum(['Linkedin', 'Glassdoor', 'Other']).optional(),
  status: z
    .enum(['Applied', 'Interviewing', 'Accepted', 'Rejected'])
    .optional(),
  resumeId: z.string().length(15).optional(),
  coverletterId: z.string().length(15).optional(),
  newComment: z.string().optional(),
});

export const DeleteApplicationModel = z.object({
  applicationIds: z.array(z.string().length(15)),
  userId: z.string().length(15),
});

export const RetrieveFilteredApplicationsModel = z.object({
  userId: z.string().length(15),
  status: z
    .enum(['Applied', 'Interviewing', 'Accepted', 'Rejected'])
    .optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// Resume Models
export const UploadResumeModel = z.object({
  userId: z.string().length(15),
  name: z.string().min(1).max(100),
});

export const RenameResumeModel = z.object({
  name: z.string().min(1).max(100),
});

export const DeleteResumesModel = z.object({
  resumeIds: z.array(z.string().length(15)),
  userId: z.string().length(15),
});

export const RetrieveFilteredResumesModel = z.object({
  userId: z.string().length(15),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// Coverletter Models
export const UploadCoverLetterModel = z.object({
  userId: z.string().length(15),
  name: z.string().min(1).max(100),
});

export const RenameCoverLetterModel = z.object({
  name: z.string().min(1).max(100),
});

export const DeleteCoverlettersModel = z.object({
  coverletterIds: z.array(z.string().length(15)),
  userId: z.string().length(15),
});

export const RetrieveFilteredCoverlettersModel = z.object({
  userId: z.string().length(15),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// Chat Models
export const CreateChatSessionModel = z.object({
  userId: z.string().length(15),
  resourceId: z.string().length(15),
});

export const CreateChatMessageModel = z.object({
  sessionId: z.string().length(15),
  content: z.string().min(1),
});

// User Models
export const CreateUserModel = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  name: z.string().optional(),
});

// Type exports
export type CreateApplicationType = z.infer<typeof CreateApplicationModel>;
export type UpdateApplicationType = z.infer<typeof UpdateApplicationModel>;
export type DeleteApplicationType = z.infer<typeof DeleteApplicationModel>;
export type UploadResumeType = z.infer<typeof UploadResumeModel>;
export type UploadCoverLetterType = z.infer<typeof UploadCoverLetterModel>;
export type CreateUserType = z.infer<typeof CreateUserModel>;
