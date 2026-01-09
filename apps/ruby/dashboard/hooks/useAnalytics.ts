import { backend } from '@ruby/shared/backend';
import type {
  AnalyticsOverview,
  StatusBreakdownData,
  TrendsPeriod,
  TrendsResponse,
} from '@sdk/AnalyticsFetcher';
import type { ApplicationType } from '@sdk/types';
import { useQuery } from '@tanstack/react-query';

export const useAnalyticsOverview = (userId: string | undefined) => {
  return useQuery<AnalyticsOverview | null>({
    queryKey: ['analytics', 'overview', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await backend.analytics.analytics.getOverview({ userId });
      return res.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAnalyticsStatusBreakdown = (userId: string | undefined) => {
  return useQuery<StatusBreakdownData | null>({
    queryKey: ['analytics', 'status-breakdown', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await backend.analytics.analytics.getStatusBreakdown({
        userId,
      });
      return res.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch application trends for area chart with configurable period
 */
export const useAnalyticsTrends = (
  userId: string | undefined,
  period: TrendsPeriod = 'last_6_months',
) => {
  return useQuery<TrendsResponse | null>({
    queryKey: ['analytics', 'trends', userId, period],
    queryFn: async () => {
      if (!userId) return null;
      const res = await backend.analytics.analytics.getTrends({
        userId,
        period,
      });
      return res.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch recent applications for activity feed
 */
export const useRecentActivity = (userId: string | undefined, limit = 10) => {
  return useQuery<ApplicationType[]>({
    queryKey: ['analytics', 'recent-activity', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      const res = await backend.apps.apps.retrieve({ userId });
      if (!res.data) return [];
      return res.data
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime(),
        )
        .slice(0, limit);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to calculate weekly activity from applications
 */
export const useWeeklyActivity = (userId: string | undefined) => {
  return useQuery<{ day: string; count: number }[]>({
    queryKey: ['analytics', 'weekly-activity', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await backend.apps.apps.retrieve({ userId });
      if (!res.data) return [];

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const dayCounts = days.map((day) => ({ day, count: 0 }));

      for (const app of res.data) {
        const createdAt = new Date(app.createdAt);
        if (createdAt >= startOfWeek) {
          const dayIndex = createdAt.getDay();
          dayCounts[dayIndex].count++;
        }
      }

      return [...dayCounts.slice(1), dayCounts[0]];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Combined hook to fetch all analytics data at once
 */
export const useAnalytics = (userId: string | undefined) => {
  const overview = useAnalyticsOverview(userId);
  const statusBreakdown = useAnalyticsStatusBreakdown(userId);
  const trends = useAnalyticsTrends(userId);

  return {
    overview,
    statusBreakdown,
    trends,
    isLoading:
      overview.isLoading || statusBreakdown.isLoading || trends.isLoading,
    isFetching:
      overview.isFetching || statusBreakdown.isFetching || trends.isFetching,
    isError: overview.isError || statusBreakdown.isError || trends.isError,
  };
};
