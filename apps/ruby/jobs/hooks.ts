import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import type {
  JobMatch,
  JobMatchStats,
  JobPreferences,
  MatchStatus,
} from '@sdk/JobFetcher';
import { useMutation, useQuery } from '@tanstack/react-query';

// ============================================
// Job Matches Hooks
// ============================================

export const useJobMatches = (
  userId: string | undefined,
  options?: {
    status?: MatchStatus | 'all';
    minScore?: number;
    limit?: number;
  },
) => {
  return useQuery({
    queryKey: ['jobMatches', userId, options?.status, options?.minScore],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const response = await backend.jobs.getMatches({
          userId,
          status: options?.status,
          minScore: options?.minScore,
          limit: options?.limit || 50,
        });
        return (response.data as JobMatch[]) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useJobMatch = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ['jobMatch', matchId],
    queryFn: async () => {
      if (!matchId) return null;
      const response = await backend.jobs.getMatch(matchId);
      return response.data as JobMatch;
    },
    enabled: !!matchId,
  });
};

export const useJobMatchStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['jobMatchStats', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const response = await backend.jobs.getMatchStats(userId);
        return (response.data as JobMatchStats) ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateMatchStatus = () => {
  return useMutation({
    mutationFn: async ({
      matchId,
      status,
    }: {
      matchId: string;
      status: MatchStatus;
    }) => {
      return backend.jobs.updateMatchStatus(matchId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches'] });
      queryClient.invalidateQueries({
        queryKey: ['jobMatch', variables.matchId],
      });
      queryClient.invalidateQueries({ queryKey: ['jobMatchStats'] });
    },
  });
};

export const useRefreshJobMatches = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      return backend.jobs.refreshMatches(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches'] });
      queryClient.invalidateQueries({ queryKey: ['jobMatchStats'] });
    },
  });
};

// ============================================
// Job Preferences Hooks
// ============================================

export const useJobPreferences = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['jobPreferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await backend.jobs.getPreferences(userId);
      return response.data as JobPreferences | null;
    },
    enabled: !!userId,
  });
};

export const useUpdateJobPreferences = () => {
  return useMutation({
    mutationFn: async (
      data: Parameters<typeof backend.jobs.updatePreferences>[0],
    ) => {
      return backend.jobs.updatePreferences(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['jobPreferences', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['jobMatches', variables.userId],
      });
    },
  });
};

// ============================================
// Job Categories & External Fetching Hooks
// ============================================

export const useJobCategories = () => {
  return useQuery({
    queryKey: ['jobCategories'],
    queryFn: async () => {
      const response = await backend.jobs.getCategories();
      return response.data ?? [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour - categories rarely change
  });
};

export const useFetchExternalJobs = () => {
  return useMutation({
    mutationFn: async (data: { categories?: string[]; limit?: number }) => {
      return backend.jobs.fetchExternalJobs(data);
    },
    onSuccess: () => {
      // Invalidate job listings and matches after fetching new jobs
      queryClient.invalidateQueries({ queryKey: ['jobListings'] });
      queryClient.invalidateQueries({ queryKey: ['jobMatches'] });
      queryClient.invalidateQueries({ queryKey: ['jobMatchStats'] });
    },
  });
};

// ============================================
// Job Listings Hooks
// ============================================

export const useJobListings = (params?: {
  search?: string;
  location?: string;
  isRemote?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['jobListings', params],
    queryFn: async () => {
      const response = await backend.jobs.getListings(params);
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
