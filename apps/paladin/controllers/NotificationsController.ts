/**
 * Notifications Controller
 * Full implementation with apiResponse pattern
 */
import { controller, del, get, inject, post } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import type { ApiResponse } from '../sdk/types';
import {
  type Notification,
  NotificationService,
} from '../services/NotificationService';

@controller('/api/notifications')
export class NotificationsController {
  constructor(
    @inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  // GET /api/notifications/:userId
  @get('/:userId')
  async getAll(c: Context): Promise<ApiResponse<Notification[] | null>> {
    try {
      const userId = c.req.param('userId');
      const unreadOnly = c.req.query('unreadOnly') === 'true';
      const limit = Number.parseInt(c.req.query('limit') || '50', 10);
      const offset = Number.parseInt(c.req.query('offset') || '0', 10);

      const notifications = this.notificationService.getNotifications(userId, {
        unreadOnly,
        limit,
        offset,
      });

      return apiResponse(c, {
        data: notifications,
        message: 'Notifications retrieved successfully',
      });
    } catch (e) {
      console.error('Get notifications error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve notifications',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/notifications/unread-count/:userId
  @get('/unread-count/:userId')
  async getUnreadCount(
    c: Context,
  ): Promise<ApiResponse<{ count: number } | null>> {
    try {
      const userId = c.req.param('userId');

      const count = this.notificationService.getUnreadCount(userId);

      return apiResponse(c, {
        data: { count },
        message: 'Unread count retrieved successfully',
      });
    } catch (e) {
      console.error('Get unread count error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to get unread count',
          isServerError: true,
        },
        500,
      );
    }
  }

  // POST /api/notifications/mark-read/:id
  @post('/mark-read/:id')
  async markRead(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean } | null>> {
    try {
      const notificationId = c.req.param('id');
      const { userId } = await c.req.json();

      const success = this.notificationService.markAsRead(
        userId,
        notificationId,
      );

      if (!success) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Notification not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: { success: true },
        message: 'Notification marked as read',
      });
    } catch (e) {
      console.error('Mark read error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to mark notification as read',
          isServerError: true,
        },
        500,
      );
    }
  }

  // POST /api/notifications/mark-all-read/:userId
  @post('/mark-all-read/:userId')
  async markAllRead(
    c: Context,
  ): Promise<ApiResponse<{ count: number } | null>> {
    try {
      const userId = c.req.param('userId');

      const count = this.notificationService.markAllAsRead(userId);

      return apiResponse(c, {
        data: { count },
        message: `${count} notifications marked as read`,
      });
    } catch (e) {
      console.error('Mark all read error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to mark all as read',
          isServerError: true,
        },
        500,
      );
    }
  }

  // DELETE /api/notifications/:id
  @del('/:id')
  async delete(c: Context): Promise<ApiResponse<{ success: boolean } | null>> {
    try {
      const notificationId = c.req.param('id');
      const userId = c.req.query('userId');

      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId is required',
            isClientError: true,
          },
          400,
        );
      }

      const success = this.notificationService.deleteNotification(
        userId,
        notificationId,
      );

      if (!success) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Notification not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: { success: true },
        message: 'Notification deleted successfully',
      });
    } catch (e) {
      console.error('Delete notification error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to delete notification',
          isServerError: true,
        },
        500,
      );
    }
  }
}
