import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useAnalytics,
  useAnalyticsOverview,
  useAnalyticsStatusBreakdown,
  useAnalyticsTrends,
} from './useAnalytics';

vi.mock('@ruby/shared/backend', () => ({
  backend: {
    analytics: {
      analytics: {
        getOverview: vi.fn(),
        getStatusBreakdown: vi.fn(),
        getTrends: vi.fn(),
      },
    },
  },
}));

import { backend } from '@ruby/shared/backend';

const mockOverviewData = {
  totalApplications: 25,
  statusCounts: {
    applied: 10,
    interviewing: 8,
    accepted: 3,
    rejected: 4,
  },
  responseRate: 60,
  thisWeekCount: 5,
  thisMonthCount: 12,
  platformCounts: {
    linkedin: 15,
    glassdoor: 5,
    other: 5,
  },
};

const mockStatusBreakdownData = {
  breakdown: [
    { name: 'Applied', value: 10, color: '#cabdf5', percentage: 40 },
    { name: 'Interviewing', value: 8, color: '#97caea', percentage: 32 },
    { name: 'Accepted', value: 3, color: '#bdf5ca', percentage: 12 },
    { name: 'Rejected', value: 4, color: '#f5bdc6', percentage: 16 },
  ],
  total: 25,
};

const mockTrendsData = {
  trends: [
    {
      label: 'Jan 2024',
      month: 'Jan',
      year: 2024,
      applications: 5,
      responses: 2,
      interviews: 1,
      accepted: 0,
      rejected: 1,
    },
    {
      label: 'Feb 2024',
      month: 'Feb',
      year: 2024,
      applications: 8,
      responses: 4,
      interviews: 2,
      accepted: 1,
      rejected: 1,
    },
    {
      label: 'Mar 2024',
      month: 'Mar',
      year: 2024,
      applications: 12,
      responses: 6,
      interviews: 3,
      accepted: 2,
      rejected: 2,
    },
  ],
  period: {
    start: '2024-01-01T00:00:00.000Z',
    end: '2024-03-31T23:59:59.999Z',
    type: 'last_year' as const,
  },
};

// Wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useAnalytics hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAnalyticsOverview', () => {
    it('should return null when userId is undefined', async () => {
      const { result } = renderHook(() => useAnalyticsOverview(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it('should fetch overview data when userId is provided', async () => {
      const mockGetOverview = vi.mocked(
        backend.analytics.analytics.getOverview,
      );
      mockGetOverview.mockResolvedValue({
        data: mockOverviewData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });

      const { result } = renderHook(() => useAnalyticsOverview('user-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGetOverview).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(result.current.data).toEqual(mockOverviewData);
    });

    it('should handle errors gracefully', async () => {
      const mockGetOverview = vi.mocked(
        backend.analytics.analytics.getOverview,
      );
      mockGetOverview.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAnalyticsOverview('user-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useAnalyticsStatusBreakdown', () => {
    it('should fetch status breakdown data', async () => {
      const mockGetStatusBreakdown = vi.mocked(
        backend.analytics.analytics.getStatusBreakdown,
      );
      mockGetStatusBreakdown.mockResolvedValue({
        data: mockStatusBreakdownData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });

      const { result } = renderHook(
        () => useAnalyticsStatusBreakdown('user-123'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGetStatusBreakdown).toHaveBeenCalledWith({
        userId: 'user-123',
      });
      expect(result.current.data?.breakdown).toHaveLength(4);
      expect(result.current.data?.total).toBe(25);
    });
  });

  describe('useAnalyticsTrends', () => {
    it('should fetch trends data with default months', async () => {
      const mockGetTrends = vi.mocked(backend.analytics.analytics.getTrends);
      mockGetTrends.mockResolvedValue({
        data: mockTrendsData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });

      const { result } = renderHook(() => useAnalyticsTrends('user-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGetTrends).toHaveBeenCalledWith({
        userId: 'user-123',
        period: 'last_6_months',
      });
      expect(result.current.data?.trends).toHaveLength(3);
    });

    it('should fetch trends data with custom months', async () => {
      const mockGetTrends = vi.mocked(backend.analytics.analytics.getTrends);
      mockGetTrends.mockResolvedValue({
        data: mockTrendsData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });

      const { result } = renderHook(
        () => useAnalyticsTrends('user-123', 'last_year'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGetTrends).toHaveBeenCalledWith({
        userId: 'user-123',
        period: 'last_year',
      });
    });
  });

  describe('useAnalytics (combined hook)', () => {
    it('should return combined loading state', async () => {
      const mockGetOverview = vi.mocked(
        backend.analytics.analytics.getOverview,
      );
      const mockGetStatusBreakdown = vi.mocked(
        backend.analytics.analytics.getStatusBreakdown,
      );
      const mockGetTrends = vi.mocked(backend.analytics.analytics.getTrends);

      mockGetOverview.mockResolvedValue({
        data: mockOverviewData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });
      mockGetStatusBreakdown.mockResolvedValue({
        data: mockStatusBreakdownData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });
      mockGetTrends.mockResolvedValue({
        data: mockTrendsData,
        success: true,
        status: 200,
        message: 'Success',
        isClientError: false,
        isServerError: false,
        isNotFound: false,
        isUnauthorized: false,
        isForbidden: false,
        debug: false,
        app: { url: 'http://localhost' },
      });

      const { result } = renderHook(() => useAnalytics('user-123'), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.overview.data).toEqual(mockOverviewData);
      expect(result.current.statusBreakdown.data).toEqual(
        mockStatusBreakdownData,
      );
      expect(result.current.trends.data).toEqual(mockTrendsData);
      expect(result.current.isError).toBe(false);
    });
  });
});
