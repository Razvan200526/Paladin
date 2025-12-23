import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export type NotificationType =
  | 'application_status_changed'
  | 'application_created'
  | 'application_deleted'
  | 'resume_uploaded'
  | 'resume_analyzed'
  | 'coverletter_uploaded'
  | 'coverletter_analyzed'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'system_announcement';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unreadCount: number;
  total: number;
};

export type UnreadCountResponse = {
  count: number;
};

export type MarkReadResult = {
  success: boolean;
  markedCount: number;
};

export type DeleteNotificationResult = {
  success: boolean;
  deletedId: string;
};

export class NotificationFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly notifications = {
    /**
     * Get all notifications for a user
     */
    getAll: async (payload: {
      userId: string;
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    }): Promise<ResponseType<NotificationsResponse | null>> => {
      const params = new URLSearchParams();
      if (payload.unreadOnly) params.set('unreadOnly', 'true');
      if (payload.limit) params.set('limit', String(payload.limit));
      if (payload.offset) params.set('offset', String(payload.offset));

      const queryString = params.toString();
      const url = `/api/notifications/${payload.userId}${queryString ? `?${queryString}` : ''}`;

      return this.fetcher.get(url);
    },

    /**
     * Get unread notification count for a user
     */
    getUnreadCount: async (payload: {
      userId: string;
    }): Promise<ResponseType<UnreadCountResponse | null>> => {
      return this.fetcher.get(
        `/api/notifications/${payload.userId}/unread-count`,
      );
    },

    /**
     * Mark a single notification as read
     */
    markAsRead: async (payload: {
      userId: string;
      notificationId: string;
    }): Promise<ResponseType<MarkReadResult | null>> => {
      return this.fetcher.post('/api/notifications/mark-read', {
        userId: payload.userId,
        notificationId: payload.notificationId,
      });
    },

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: async (payload: {
      userId: string;
    }): Promise<ResponseType<MarkReadResult | null>> => {
      return this.fetcher.post(
        `/api/notifications/${payload.userId}/mark-all-read`,
        {},
      );
    },

    /**
     * Delete a notification
     */
    delete: async (payload: {
      userId: string;
      notificationId: string;
    }): Promise<ResponseType<DeleteNotificationResult | null>> => {
      return this.fetcher.delete('/api/notifications/delete', {
        userId: payload.userId,
        notificationId: payload.notificationId,
      });
    },
  };
}
