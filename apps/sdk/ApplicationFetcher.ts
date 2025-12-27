import type { CreateApplicationFormData } from '@ruby/applications/components/CreateApplicationButton';
import type { ApplicationFilters } from '@ruby/resources/shared/filterUtils';
import type { Fetcher } from './Fetcher';
import type { ApplicationType, ResponseType } from './types';

export type UpdateApplicationData = {
  employer?: string;
  jobTitle?: string;
  location?: string;
  jobUrl?: string | null;
  salaryRange?: string | null;
  currency?: string;
  contact?: string | null;
  platform?: 'Linkedin' | 'Glassdoor' | 'Other';
  status?: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  resumeId?: string;
  coverletterId?: string;
  newComment?: string;
};

export type DeleteApplicationResult = {
  success: boolean;
  deletedCount: number;
};

export class ApplicationFetcher {
  constructor(readonly fetcher: Fetcher) { }

  public readonly apps = {
    /**
     * Filter applications by various criteria
     */
    filter: async (payload: {
      filters: ApplicationFilters;
      userId: string;
    }): Promise<ResponseType<ApplicationType[] | null>> => {
      const params = new URLSearchParams(
        Object.entries(payload.filters).map(([k, v]) => [k, String(v)]),
      );
      return this.fetcher.get(
        `/api/applications/${payload.userId}/filter?${params.toString()}`,
      );
    },

    /**
     * Retrieve all applications for a user
     */
    retrieve: async (payload: {
      userId: string;
    }): Promise<ResponseType<ApplicationType[]>> => {
      return this.fetcher.get(`/api/applications/${payload.userId}`);
    },

    /**
     * Get a single application by ID
     */
    getApp: async (payload: {
      applicationId: string;
    }): Promise<ResponseType<ApplicationType>> => {
      return this.fetcher.get(`/api/applications/single/${payload.applicationId}`);
    },

    /**
     * Create a new application
     */
    create: async (payload: {
      data: CreateApplicationFormData;
      userId: string;
    }): Promise<ResponseType<{ newApplication: ApplicationType }>> => {
      return this.fetcher.post('/api/applications/create', payload);
    },

    /**
     * Update an existing application
     */
    update: async (payload: {
      applicationId: string;
      userId: string;
      data: UpdateApplicationData;
    }): Promise<ResponseType<{ application: ApplicationType } | null>> => {
      return this.fetcher.put(
        `/api/applications/update/${payload.applicationId}`,
        {
          userId: payload.userId,
          data: payload.data,
        },
      );
    },

    /**
     * Update only the status of an application
     */
    updateStatus: async (payload: {
      applicationId: string;
      userId: string;
      status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
    }): Promise<ResponseType<{ application: ApplicationType } | null>> => {
      return this.fetcher.put(
        `/api/applications/update/${payload.applicationId}`,
        {
          userId: payload.userId,
          data: { status: payload.status },
        },
      );
    },

    /**
     * Delete one or more applications
     */
    delete: async (payload: {
      applicationIds: string[];
      userId: string;
    }): Promise<ResponseType<DeleteApplicationResult>> => {
      return this.fetcher.delete('/api/applications/delete', {
        applicationIds: payload.applicationIds,
        userId: payload.userId,
      });
    },

    /**
     * Delete a single application
     */
    deleteOne: async (payload: {
      applicationId: string;
      userId: string;
    }): Promise<ResponseType<DeleteApplicationResult>> => {
      return this.fetcher.delete('/api/applications/delete', {
        applicationIds: [payload.applicationId],
        userId: payload.userId,
      });
    },
  };
}
