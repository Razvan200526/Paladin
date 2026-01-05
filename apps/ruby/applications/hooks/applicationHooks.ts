import { Toast } from '@common/components/toast';
import type { ApplicationFilters } from '@ruby/resources/shared/filterUtils';
import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import type { ApplicationType } from '@sdk/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import type { UpdateApplicationData } from '../../../sdk/ApplicationFetcher';
import type { CreateApplicationFormData } from '../components/CreateApplicationButton';

export const useApplications = (userId: string) => {
  return useQuery({
    queryKey: ['applications', 'retrieve'],
    queryFn: async () => {
      console.debug('User id', userId);
      const res = await backend.apps.apps.retrieve({
        userId: userId,
      });
      return res.data;
    },
  });
};

export const useGetApplication = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['applications', 'retrieve', id],
    queryFn: async () => {
      const res = await backend.apps.apps.getApp({
        applicationId: id || '',
      });
      return res.data as ApplicationType;
    },
  });
};

export const useCreateApplication = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      data: CreateApplicationFormData;
    }) => {
      const { userId, data } = variables;
      return backend.apps.apps.create({
        data: data,
        userId: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
    },
  });
};
export const useFilterApplications = (userId: string) => {
  return useMutation({
    mutationFn: async (data: { filters: ApplicationFilters }) => {
      const response = await backend.apps.apps.filter({
        filters: data.filters,
        userId,
      });
      if (!response.success) {
        Toast.error({
          description: response.message || 'Could not filter applications',
        });
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applications', userId],
      });
    },
  });
};

export const useUpdateApplication = () => {
  return useMutation({
    mutationFn: async (variables: {
      applicationId: string;
      userId: string;
      data: UpdateApplicationData;
    }) => {
      const response = await backend.apps.apps.update({
        applicationId: variables.applicationId,
        userId: variables.userId,
        data: variables.data,
      });
      if (!response.success) {
        Toast.error({
          description: response.message || 'Could not update application',
        });
      }
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve', variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });
      Toast.success({
        description: 'Application updated successfully',
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: async (variables: {
      applicationId: string;
      userId: string;
      status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
    }) => {
      const response = await backend.apps.apps.updateStatus({
        applicationId: variables.applicationId,
        userId: variables.userId,
        status: variables.status,
      });
      if (!response.success) {
        Toast.error({
          description:
            response.message || 'Could not update application status',
        });
      }
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve', variables.applicationId],
      });
      // Invalidate analytics since status changed
      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });
      Toast.success({
        description: 'Application status updated',
      });
    },
  });
};

export const useDeleteApplication = (userId: string) => {
  return useMutation({
    mutationFn: async (variables: { applicationIds: string[] }) => {
      const response = await backend.apps.apps.delete({
        applicationIds: variables.applicationIds,
        userId: userId,
      });
      if (!response.success) {
        Toast.error({
          description: response.message || 'Could not delete application(s)',
        });
      }
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });
      Toast.success({
        description: `Successfully deleted ${data.data?.deletedCount || 1} application(s)`,
      });
    },
  });
};

export const useDeleteSingleApplication = () => {
  return useMutation({
    mutationFn: async (variables: {
      applicationId: string;
      userId: string;
    }) => {
      const response = await backend.apps.apps.deleteOne({
        applicationId: variables.applicationId,
        userId: variables.userId,
      });
      if (!response.success) {
        Toast.error({
          description: response.message || 'Could not delete application',
        });
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['applications', 'retrieve'],
      });
      // Invalidate analytics
      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });
      Toast.success({
        description: 'Application deleted successfully',
      });
    },
  });
};
