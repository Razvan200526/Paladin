import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StatsSection } from './StatsSection';

// Mock the hooks
vi.mock('@ruby/shared/hooks', () => ({
  useAuth: vi.fn(() => ({
    data: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
    isLoading: false,
  })),
}));

vi.mock('../hooks/useAnalytics', () => ({
  useAnalyticsOverview: vi.fn(),
}));

import { useAnalyticsOverview } from '../hooks/useAnalytics';

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

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('StatsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render skeleton when loading', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: undefined,
        isFetching: true,
        isError: false,
        isLoading: true,
        isSuccess: false,
        error: null,
        refetch: vi.fn(),
        status: 'pending',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      // The skeleton should be rendered during loading
      // We can check that the actual stats are not rendered
      expect(screen.queryByText('Total Applications')).not.toBeInTheDocument();
    });

    it('should render skeleton when data is null', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: null,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.queryByText('Total Applications')).not.toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display total applications', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('Total Applications')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should display response rate', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('Response Rate')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('should display interviewing count', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('Interviewing')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should display this week count', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('This Week')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('should show positive trend for this month applications', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      // Check for the +12 change indicator (thisMonthCount)
      expect(screen.getByText('+12')).toBeInTheDocument();
    });

    it('should show positive trend for high response rate', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: { ...mockOverviewData, responseRate: 60 },
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      // Response rate > 30 should show +5%
      expect(screen.getByText('+5%')).toBeInTheDocument();
    });

    it('should show negative trend for low response rate', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: { ...mockOverviewData, responseRate: 20 },
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      // Response rate <= 30 should show -2%
      expect(screen.getByText('-2%')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero applications', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: {
          totalApplications: 0,
          statusCounts: {
            applied: 0,
            interviewing: 0,
            accepted: 0,
            rejected: 0,
          },
          responseRate: 0,
          thisWeekCount: 0,
          thisMonthCount: 0,
          platformCounts: {
            linkedin: 0,
            glassdoor: 0,
            other: 0,
          },
        },
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('Total Applications')).toBeInTheDocument();
      expect(screen.getAllByText('0%')).toHaveLength(2);
    });

    it('should render error state as skeleton', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: true,
        isLoading: false,
        isSuccess: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
        status: 'error',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      // On error, skeleton should be shown
      expect(screen.queryByText('Total Applications')).not.toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should render four stat cards', () => {
      vi.mocked(useAnalyticsOverview).mockReturnValue({
        data: mockOverviewData,
        isFetching: false,
        isError: false,
        isLoading: false,
        isSuccess: true,
        error: null,
        refetch: vi.fn(),
        status: 'success',
      } as any);

      render(<StatsSection />, { wrapper: createWrapper() });

      expect(screen.getByText('Total Applications')).toBeInTheDocument();
      expect(screen.getByText('Response Rate')).toBeInTheDocument();
      expect(screen.getByText('Interviewing')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
    });
  });
});
