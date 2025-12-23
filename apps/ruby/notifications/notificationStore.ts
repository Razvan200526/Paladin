import type { Notification } from '@client/sdk/NotificationFetcher';
import { create } from 'zustand';

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
};

type NotificationActions = {
  // State setters
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  setUnreadCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  setError: (error: string | null) => void;

  // Actions
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;

  // Reset
  reset: () => void;
};

type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isConnected: false,
  error: null,
};

export const useNotificationStore = create<NotificationStore>((set, _get) => ({
  ...initialState,

  // State setters
  setNotifications: (notifications) => {
    set({ notifications });
    // Update unread count based on notifications
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ unreadCount });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read
        ? state.unreadCount
        : state.unreadCount + 1,
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId,
      );
      const wasUnread = notification && !notification.read;

      return {
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId,
        ),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  setUnreadCount: (count) => {
    set({ unreadCount: count });
  },

  setIsLoading: (isLoading) => {
    set({ isLoading });
  },

  setIsConnected: (isConnected) => {
    set({ isConnected });
  },

  setError: (error) => {
    set({ error });
  },

  // Actions
  markAsRead: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId,
      );
      const wasUnread = notification && !notification.read;

      return {
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n,
        ),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  incrementUnreadCount: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  decrementUnreadCount: () => {
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));

// Selectors
export const selectNotifications = (state: NotificationStore) =>
  state.notifications;
export const selectUnreadCount = (state: NotificationStore) =>
  state.unreadCount;
export const selectUnreadNotifications = (state: NotificationStore) =>
  state.notifications.filter((n) => !n.read);
export const selectIsConnected = (state: NotificationStore) =>
  state.isConnected;
export const selectIsLoading = (state: NotificationStore) => state.isLoading;
export const selectError = (state: NotificationStore) => state.error;

// Helper to get notifications by type
export const selectNotificationsByType = (
  state: NotificationStore,
  type: Notification['type'],
) => state.notifications.filter((n) => n.type === type);

// Helper to get high priority notifications
export const selectHighPriorityNotifications = (state: NotificationStore) =>
  state.notifications.filter(
    (n) => n.priority === 'high' || n.priority === 'urgent',
  );
