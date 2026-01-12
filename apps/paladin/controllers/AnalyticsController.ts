import type {
  StatusBreakdownData,
  TrendsData,
  TrendsPeriod,
} from '@common/types';
import { controller, get, inject, logger } from '@razvan11/paladin';
import type { Context } from 'hono';
import { MoreThanOrEqual } from 'typeorm';
import { apiResponse } from '../client';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { ApiResponse } from '../sdk/types';
import { CacheService } from '../services/CacheService';

// Cache TTL constants (in seconds)
const OVERVIEW_CACHE_TTL = 60 * 5; // 5 minutes
const STATUS_BREAKDOWN_CACHE_TTL = 60 * 5; // 5 minutes
const TRENDS_CACHE_TTL = 60 * 15; // 15 minutes

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
    @inject(CacheService)
    private readonly cache: CacheService,
  ) {}

  /**
   * Get cache key for analytics overview
   */
  private getOverviewCacheKey(userId: string): string {
    return `analytics:${userId}:overview`;
  }

  /**
   * Get cache key for status breakdown
   */
  private getStatusBreakdownCacheKey(userId: string): string {
    return `analytics:${userId}:statusBreakdown`;
  }

  /**
   * Get cache key for trends
   */
  private getTrendsCacheKey(userId: string, period: string): string {
    return `analytics:${userId}:trends:${period}`;
  }

  // GET /api/analytics/overview/:userId
  @get('/overview/:userId')
  async overview(c: Context): Promise<ApiResponse<AnalyticsOverview | null>> {
    try {
      const userId = c.req.param('userId');
      const cacheKey = this.getOverviewCacheKey(userId);

      const cached = await this.cache.get<AnalyticsOverview>(cacheKey);
      if (cached) {
        logger.info(`[AnalyticsController] Cache hit for overview: ${userId}`);
        return apiResponse(c, {
          data: cached,
          message: 'Analytics overview retrieved successfully (cached)',
        });
      }

      logger.info(`[AnalyticsController] Cache miss for overview: ${userId}`);

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

      const thisMonthApplications = await this.appRepo.find({
        where: {
          user: { id: userId },
          createdAt: MoreThanOrEqual(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ),
        },
      });
      const thisMonthCount = thisMonthApplications?.length ?? 0;
      const thisWeekApplications = await this.appRepo.find({
        where: {
          user: { id: userId },
          createdAt: MoreThanOrEqual(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ),
        },
      });
      const thisWeekCount = thisWeekApplications?.length ?? 0;
      const responseRate =
        totalApplications > 0
          ? ((accepted + interviewing + rejected) / totalApplications) * 100
          : 0;

      const data = {
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
      };

      await this.cache.set(cacheKey, data, OVERVIEW_CACHE_TTL);

      return apiResponse(c, {
        data,
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
      const cacheKey = this.getStatusBreakdownCacheKey(userId);

      const cached = await this.cache.get<StatusBreakdownData>(cacheKey);
      if (cached) {
        logger.info(
          `[AnalyticsController] Cache hit for status breakdown: ${userId}`,
        );
        return apiResponse(c, {
          data: cached,
          message: 'Status breakdown retrieved successfully (cached)',
        });
      }

      logger.info(
        `[AnalyticsController] Cache miss for status breakdown: ${userId}`,
      );

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
        {
          name: 'Applied',
          value: applied,
          color: 'var(--color-primary-500)',
          percentage: total > 0 ? (applied / total) * 100 : 0,
        },
        {
          name: 'Interviewing',
          value: interviewing,
          color: 'var(--color-secondary-500)',
          percentage: total > 0 ? (interviewing / total) * 100 : 0,
        },
        {
          name: 'Accepted',
          value: accepted,
          color: 'var(--color-green-500)',
          percentage: total > 0 ? (accepted / total) * 100 : 0,
        },
        {
          name: 'Rejected',
          value: rejected,
          color: 'var(--color-red-500)',
          percentage: total > 0 ? (rejected / total) * 100 : 0,
        },
      ];

      const data = {
        breakdown,
        total,
      };

      await this.cache.set(cacheKey, data, STATUS_BREAKDOWN_CACHE_TTL);

      return apiResponse(c, {
        data,
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
      const cacheKey = this.getTrendsCacheKey(userId, period);

      const cached = await this.cache.get<TrendsData>(cacheKey);
      if (cached) {
        logger.info(`[AnalyticsController] Cache hit for trends: ${userId}`);
        return apiResponse(c, {
          data: cached,
          message: 'Trends retrieved successfully (cached)',
        });
      }

      logger.info(`[AnalyticsController] Cache miss for trends: ${userId}`);

      const applications = await this.appRepo.findByUser(userId);

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

      const filteredApps = applications.filter(
        (app) => new Date(app.createdAt) >= startDate,
      );

      const groupByDay = period === 'last_week' || period === 'last_month';

      const allPeriods: { key: string; label: string; date: Date }[] = [];
      const current = new Date(startDate);

      if (groupByDay) {
        current.setHours(0, 0, 0, 0);
        while (current <= now) {
          const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
          const label = current.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
          });
          allPeriods.push({ key, label, date: new Date(current) });
          current.setDate(current.getDate() + 1);
        }
      } else {
        current.setDate(1);
        while (current <= now) {
          const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
          const label = current.toLocaleDateString('en-US', { month: 'short' });
          allPeriods.push({ key, label, date: new Date(current) });
          current.setMonth(current.getMonth() + 1);
        }
      }

      const groupedData: Record<
        string,
        {
          label: string;
          applications: number;
          responses: number;
          interviews: number;
          accepted: number;
          rejected: number;
        }
      > = {};
      allPeriods.forEach((p) => {
        groupedData[p.key] = {
          label: p.label,
          applications: 0,
          responses: 0,
          interviews: 0,
          accepted: 0,
          rejected: 0,
        };
      });

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

      const data = {
        trends,
        period: {
          start: startDate.toISOString(),
          end: now.toISOString(),
          type: period,
        },
      };

      await this.cache.set(cacheKey, data, TRENDS_CACHE_TTL);

      return apiResponse(c, {
        data,
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

  /**
   * Invalidate all analytics cache for a user
   * Call this when applications are created, updated, or deleted
   */
  async invalidateUserCache(userId: string): Promise<void> {
    logger.info(`[AnalyticsController] Invalidating cache for user: ${userId}`);
    await this.cache.deletePattern(`analytics:${userId}:*`);
  }
}
