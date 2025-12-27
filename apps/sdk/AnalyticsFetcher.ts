import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export type AnalyticsOverview = {
  totalApplications: number;
  statusCounts: {
    applied: number;
    interviewing: number;
    accepted: number;
    rejected: number;
  };
  responseRate: number;
  thisWeekCount: number;
  thisMonthCount: number;
  platformCounts: {
    linkedin: number;
    glassdoor: number;
    other: number;
  };
};

export type StatusBreakdownItem = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

export type StatusBreakdownData = {
  breakdown: StatusBreakdownItem[];
  total: number;
};

export type TrendsPeriod =
  | 'last_week'
  | 'last_month'
  | 'last_3_months'
  | 'last_6_months'
  | 'last_year';

export type TrendDataPoint = {
  label: string;
  applications: number;
  responses: number;
  interviews: number;
  accepted: number;
  rejected: number;
};

export type TrendsResponse = {
  trends: TrendDataPoint[];
  period: {
    start: string;
    end: string;
    type: TrendsPeriod;
  };
};

export class AnalyticsFetcher {
  constructor(readonly fetcher: Fetcher) { }

  public readonly analytics = {
    /**
     * Get analytics overview for a user (total apps, response rate, status counts)
     */
    getOverview: async (payload: {
      userId: string;
    }): Promise<ResponseType<AnalyticsOverview | null>> => {
      return this.fetcher.get(`/api/analytics/overview/${payload.userId}`);
    },

    /**
     * Get application status breakdown for pie chart
     */
    getStatusBreakdown: async (payload: {
      userId: string;
    }): Promise<ResponseType<StatusBreakdownData | null>> => {
      return this.fetcher.get(
        `/api/analytics/status-breakdown/${payload.userId}`,
      );
    },

    /**
     * Get application trends for area chart with configurable period
     * @param period - Time period to fetch (default: 'last_6_months')
     */
    getTrends: async (payload: {
      userId: string;
      period?: TrendsPeriod;
    }): Promise<ResponseType<TrendsResponse | null>> => {
      const params = payload.period ? `?period=${payload.period}` : '';
      return this.fetcher.get(
        `/api/analytics/trends/${payload.userId}${params}`,
      );
    },
  };
}
