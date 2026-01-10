/**
 * Notification Service
 * Migrated from Paladin - manages in-memory notifications and WebSocket broadcasts
 */
import { service } from '@razvan11/paladin';

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
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
};

export type NotificationPayload = {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  expiresAt?: Date;
};

type WebSocketConnection = {
  userId: string;
  ws: WebSocket;
  connectedAt: Date;
};

@service()
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification[]> = new Map();
  private connections: Map<string, WebSocketConnection[]> = new Map();
  private listeners: Map<string, ((notification: Notification) => void)[]> =
    new Map();

  constructor() {
    this.startCleanupInterval();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public registerConnection(userId: string, ws: WebSocket): void {
    const connection: WebSocketConnection = {
      userId,
      ws,
      connectedAt: new Date(),
    };
    const existingConnections = this.connections.get(userId) || [];
    existingConnections.push(connection);
    this.connections.set(userId, existingConnections);
    this.sendUnreadNotifications(userId, ws);
  }

  public unregisterConnection(userId: string, ws: WebSocket): void {
    const connections = this.connections.get(userId);
    if (connections) {
      const filtered = connections.filter((c) => c.ws !== ws);
      if (filtered.length > 0) {
        this.connections.set(userId, filtered);
      } else {
        this.connections.delete(userId);
      }
    }
  }

  public async notify(
    userId: string,
    payload: NotificationPayload,
  ): Promise<Notification> {
    const notification: Notification = {
      id: this.generateId(),
      userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      priority: payload.priority || 'medium',
      data: payload.data,
      read: false,
      createdAt: new Date(),
      expiresAt: payload.expiresAt,
    };

    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift(notification);

    if (userNotifications.length > 100) {
      userNotifications.pop();
    }
    this.notifications.set(userId, userNotifications);

    this.broadcast(userId, { event: 'notification', data: notification });
    this.triggerListeners(userId, notification);

    return notification;
  }

  public broadcast(userId: string, message: Record<string, any>): void {
    const connections = this.connections.get(userId);
    if (!connections || connections.length === 0) return;

    const payload = JSON.stringify(message);

    for (const connection of connections) {
      try {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(payload);
        }
      } catch (error) {
        console.error(`Failed to send message to user ${userId}:`, error);
      }
    }
  }

  public getNotifications(
    userId: string,
    options?: { unreadOnly?: boolean; limit?: number; offset?: number },
  ): Notification[] {
    let notifications = this.notifications.get(userId) || [];

    if (options?.unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    const offset = options?.offset || 0;
    const limit = options?.limit || 50;

    return notifications.slice(offset, offset + limit);
  }

  public getUnreadCount(userId: string): number {
    const notifications = this.notifications.get(userId) || [];
    return notifications.filter((n) => !n.read).length;
  }

  public markAsRead(userId: string, notificationId: string): boolean {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.broadcast(userId, {
        event: 'notification_read',
        data: { notificationId },
      });
      return true;
    }

    return false;
  }

  public markAllAsRead(userId: string): number {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    let count = 0;
    for (const notification of notifications) {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    }

    this.broadcast(userId, {
      event: 'all_notifications_read',
      data: { count },
    });
    return count;
  }

  public deleteNotification(userId: string, notificationId: string): boolean {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const index = notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications.splice(index, 1);
      this.broadcast(userId, {
        event: 'notification_deleted',
        data: { notificationId },
      });
      return true;
    }

    return false;
  }

  public isUserConnected(userId: string): boolean {
    const connections = this.connections.get(userId);
    return !!connections && connections.length > 0;
  }

  private sendUnreadNotifications(userId: string, ws: WebSocket): void {
    const unread = this.getNotifications(userId, { unreadOnly: true });
    if (unread.length > 0) {
      try {
        ws.send(
          JSON.stringify({
            event: 'unread_notifications',
            data: { notifications: unread, count: unread.length },
          }),
        );
      } catch (error) {
        console.error(
          `Failed to send unread notifications to user ${userId}:`,
          error,
        );
      }
    }
  }

  private triggerListeners(userId: string, notification: Notification): void {
    const listeners = this.listeners.get(userId);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(notification);
        } catch (error) {
          console.error(`Listener error for user ${userId}:`, error);
        }
      }
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = new Date();
      for (const [userId, notifications] of this.notifications) {
        const filtered = notifications.filter((n) => {
          if (n.expiresAt && n.expiresAt < now) return false;
          return true;
        });
        if (filtered.length !== notifications.length) {
          this.notifications.set(userId, filtered);
        }
      }
    }, 60000);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 17);
  }
}

export const notificationService = NotificationService.getInstance();
