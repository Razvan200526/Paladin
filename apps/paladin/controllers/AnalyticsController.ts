/**
 * Analytics Controller
 * Full implementation with apiResponse pattern
 */
import { controller, get, inject } from '@razvan11/paladin';
import { apiResponse } from '../client';
import type { ApiResponse } from '../sdk/types';
import type { Context } from 'hono';
import type { ApplicationRepository } from '../repositories/ApplicationRepository';

type AnalyticsOverview = {
  total: number;
  applied: number;
  interviewing: number;
  accepted: number;
  rejected: number;
};

type StatusBreakdownItem = {
  status: string;
  count: number;
};

type TrendItem = {
  month: string;
  count: number;
};

@controller('/api/analytics')
export class AnalyticsController {
  constructor(
    @inject('ApplicationRepository')
    private readonly appRepo: ApplicationRepository,
  ) {}

  // GET /api/analytics/overview/:userId
  @get('/overview/:userId')
  async overview(c: Context): Promise<ApiResponse<AnalyticsOverview | null>> {
    try {
      const userId = c.req.param('userId');

      const total = await this.appRepo.countByUser(userId);
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

      return apiResponse(c, {
        data: {
          total,
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
  ): Promise<ApiResponse<StatusBreakdownItem[] | null>> {
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

      return apiResponse(c, {
        data: [
          { status: 'Applied', count: applied },
          { status: 'Interviewing', count: interviewing },
          { status: 'Accepted', count: accepted },
          { status: 'Rejected', count: rejected },
        ],
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
  async trends(c: Context): Promise<ApiResponse<TrendItem[] | null>> {
    try {
      const userId = c.req.param('userId');
      const applications = await this.appRepo.findByUser(userId);

      // Group by month for trends
      const monthlyData: Record<string, number> = {};
      applications.forEach((app) => {
        const month = new Date(app.createdAt).toISOString().slice(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      const trends = Object.entries(monthlyData)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return apiResponse(c, {
        data: trends,
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
