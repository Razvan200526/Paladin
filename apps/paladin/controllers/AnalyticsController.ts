/**
 * Analytics Controller
 * Full implementation with apiResponse pattern
 */
import { controller, get, inject, logger } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { ApiResponse } from '../sdk/types';
import { MoreThanOrEqual } from 'typeorm';
import type {
  TrendsData,
  TrendsPeriod,
  StatusBreakdownData,
} from '@common/types';

type AnalyticsOverview = {
  totalApplications: number;
  applied: number;
  interviewing: number;
  accepted: number;
  rejected: number;
  statusCounts: {
    applied: number;
    interviewing: number;
    accepted: number;
    rejected: number;
  };
  thisWeekCount: number;
  responseRate: number;
};

@controller('/api/analytics')
export class AnalyticsController {
  constructor(
    @inject(ApplicationRepository)
    private readonly appRepo: ApplicationRepository,
  ) { }

  // GET /api/analytics/overview/:userId
  @get('/overview/:userId')
  async overview(c: Context): Promise<ApiResponse<AnalyticsOverview | null>> {
    try {
      const userId = c.req.param('userId');

      const totalApplications = await this.appRepo.countByUser(userId);
      const applied = await this.appRepo.countByUserAndStatus(
        userId,
        'Applied',
      );
      const interviewing = await this.appRepo.countByUserAndStatus(
        userId,
        'Interviewing',
      );
      const accepted = await this.appRepo.countByUserAndStatus(
        userId,
        'Accepted',
      );
      const rejected = await this.appRepo.countByUserAndStatus(
        userId,
        'Rejected',
      );

      const thisMonthApplications = await this.appRepo.find({ where: { user: { id: userId }, createdAt: MoreThanOrEqual(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) } })
      const thisMonthCount = thisMonthApplications?.length ?? 0;
      const thisWeekApplications = await this.appRepo.find({ where: { user: { id: userId }, createdAt: MoreThanOrEqual(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) } });
      const thisWeekCount = thisWeekApplications?.length ?? 0;
      const responseRate = totalApplications > 0 ? ((accepted + interviewing + rejected) / totalApplications) * 100 : 0;

      return apiResponse(c, {
        data: {
          totalApplications,
          statusCounts: {
            applied,
            interviewing,
            accepted,
            rejected,
          },
          thisMonthCount,
          thisWeekCount,
          responseRate,
          applied,
          interviewing,
          accepted,
          rejected,
        },
        message: 'Analytics overview retrieved successfully',
      });
    } catch (e) {
      console.error('Analytics overview error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve analytics',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/analytics/status-breakdown/:userId
  @get('/status-breakdown/:userId')
  async statusBreakdown(
    c: Context,
  ): Promise<ApiResponse<StatusBreakdownData | null>> {
    try {
      const userId = c.req.param('userId');

      const applied = await this.appRepo.countByUserAndStatus(
        userId,
        'Applied',
      );
      const interviewing = await this.appRepo.countByUserAndStatus(
        userId,
        'Interviewing',
      );
      const accepted = await this.appRepo.countByUserAndStatus(
        userId,
        'Accepted',
      );
      const rejected = await this.appRepo.countByUserAndStatus(
        userId,
        'Rejected',
      );

      const total = applied + interviewing + accepted + rejected;

      const breakdown = [
        { name: 'Applied', value: applied, color: 'var(--color-primary-500)', percentage: total > 0 ? (applied / total) * 100 : 0 },
        { name: 'Interviewing', value: interviewing, color: 'var(--color-secondary-500)', percentage: total > 0 ? (interviewing / total) * 100 : 0 },
        { name: 'Accepted', value: accepted, color: 'var(--color-green-500)', percentage: total > 0 ? (accepted / total) * 100 : 0 },
        { name: 'Rejected', value: rejected, color: 'var(--color-red-500)', percentage: total > 0 ? (rejected / total) * 100 : 0 },
      ];

      return apiResponse(c, {
        data: {
          breakdown,
          total,
        },
        message: 'Status breakdown retrieved successfully',
      });
    } catch (e) {
      console.error('Status breakdown error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve status breakdown',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/analytics/trends/:userId
  @get('/trends/:userId')
  async trends(c: Context): Promise<ApiResponse<TrendsData | null>> {
    try {
      const userId = c.req.param('userId');
      const period = (c.req.query('period') || 'last_6_months') as TrendsPeriod;
      const applications = await this.appRepo.findByUser(userId);

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last_3_months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'last_6_months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case 'last_year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      }

      // Filter applications within period
      const filteredApps = applications.filter(
        (app) => new Date(app.createdAt) >= startDate
      );

      // Determine if we should group by day or month
      const groupByDay = period === 'last_week' || period === 'last_month';

      // Generate all periods in the range (even empty ones)
      const allPeriods: { key: string; label: string; date: Date }[] = [];
      const current = new Date(startDate);

      if (groupByDay) {
        // Group by day for week/month views
        current.setHours(0, 0, 0, 0);
        while (current <= now) {
          const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
          const label = current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
          allPeriods.push({ key, label, date: new Date(current) });
          current.setDate(current.getDate() + 1);
        }
      } else {
        // Group by month for longer periods
        current.setDate(1);
        while (current <= now) {
          const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
          const label = current.toLocaleDateString('en-US', { month: 'short' });
          allPeriods.push({ key, label, date: new Date(current) });
          current.setMonth(current.getMonth() + 1);
        }
      }

      // Initialize all periods with zero values
      const groupedData: Record<string, { label: string; applications: number; responses: number; interviews: number; accepted: number; rejected: number }> = {};
      allPeriods.forEach(p => {
        groupedData[p.key] = { label: p.label, applications: 0, responses: 0, interviews: 0, accepted: 0, rejected: 0 };
      });

      // Populate with actual application data
      filteredApps.forEach((app) => {
        const date = new Date(app.createdAt);
        let key: string;

        if (groupByDay) {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        } else {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (groupedData[key]) {
          groupedData[key].applications += 1;

          // Count based on status
          const status = app.status?.toLowerCase() || '';
          if (status === 'interviewing') {
            groupedData[key].interviews += 1;
            groupedData[key].responses += 1;
          } else if (status === 'accepted' || status === 'offer') {
            groupedData[key].accepted += 1;
            groupedData[key].responses += 1;
          } else if (status === 'rejected') {
            groupedData[key].rejected += 1;
            groupedData[key].responses += 1;
          }
        }
      });

      // Sort by key (chronological) and return
      const trends = Object.entries(groupedData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, data]) => ({
          label: data.label,
          applications: data.applications,
          responses: data.responses,
          interviews: data.interviews,
          accepted: data.accepted || 0,
          rejected: data.rejected || 0,
        }));

      return apiResponse(c, {
        data: {
          trends,
          period: {
            start: startDate.toISOString(),
            end: now.toISOString(),
            type: period,
          },
        },
        message: 'Trends retrieved successfully',
      });
    } catch (e) {
      console.error('Trends error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve trends',
          isServerError: true,
        },
        500,
      );
    }
  }
}
