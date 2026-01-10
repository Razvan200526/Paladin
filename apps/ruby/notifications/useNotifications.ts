import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import type {
  Notification,
  NotificationsResponse,
} from '@sdk/NotificationFetcher';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to fetch notifications for a user
 */
export const useNotifications = (
  userId: string | undefined,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
    enabled?: boolean;
  },
) => {
  return useQuery<NotificationsResponse | null>({
    queryKey: ['notifications', userId, options?.unreadOnly],
    queryFn: async () => {
      if (!userId) return null;
      const res = await backend.notifications.notifications.getAll({
        userId,
        unreadOnly: options?.unreadOnly,
        limit: options?.limit || 50,
      });
      return res.data;
    },
    enabled: !!userId && options?.enabled !== false,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadNotificationCount = (userId: string | undefined) => {
  return useQuery<number>({
    queryKey: ['notifications', 'unread-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      console.debug(process.env.APP_WS_URL);
      const res = await backend.notifications.notifications.getUnreadCount({
        userId,
      });
      return res.data?.count || 0;
    },
    enabled: !!userId,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 30,
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      notificationId: string;
    }) => {
      return backend.notifications.notifications.markAsRead({
        userId: variables.userId,
        notificationId: variables.notificationId,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', variables.userId],
      });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: async (variables: { userId: string }) => {
      return backend.notifications.notifications.markAllAsRead({
        userId: variables.userId,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', variables.userId],
      });
    },
  });
};

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      notificationId: string;
    }) => {
      return backend.notifications.notifications.delete({
        userId: variables.userId,
        notificationId: variables.notificationId,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', variables.userId],
      });
    },
  });
};

/**
 * Hook for real-time notifications via WebSocket
 */
/**
 * Hook for real-time notifications via WebSocket
 */
export const useRealtimeNotifications = (
  userId: string | undefined,
  options?: {
    onNotification?: (notification: Notification) => void;
    enabled?: boolean;
  },
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notification | null>(
    null,
  );
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);

  const onNotificationRef = useRef(options?.onNotification);
  onNotificationRef.current = options?.onNotification;

  const enabledRef = useRef(options?.enabled !== false);
  enabledRef.current = options?.enabled !== false;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttempts.current = 0;
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(() => {
    if (isConnectingRef.current) {
      console.debug('[WebSocket] Already connecting, skipping');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.debug('[WebSocket] Already connected, skipping');
      return;
    }

    if (!userId || !enabledRef.current) {
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('[WebSocket] Max reconnect attempts reached');
      return;
    }

    isConnectingRef.current = true;

    const wsUrl = `${process.env.APP_WS_URL}/ws`;

    try {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      console.debug('[WebSocket] Connecting to', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        console.debug('[WebSocket] Connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;

        ws.send(
          JSON.stringify({
            action: 'subscribe',
            userId,
          }),
        );
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const data = JSON.parse(event.data);

          if (data.type === 'notification' && data.payload) {
            const notification = data.payload as Notification;
            setLastNotification(notification);
            onNotificationRef.current?.(notification);

            queryClient.invalidateQueries({
              queryKey: ['notifications', userId],
            });
            queryClient.invalidateQueries({
              queryKey: ['notifications', 'unread-count', userId],
            });
          }

          if (data.type === 'unread_notifications' && data.data) {
            const notifications = data.data.notifications as Notification[];
            if (notifications.length > 0) {
              setLastNotification(notifications[0]);
            }
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onclose = (event) => {
        console.debug('[WebSocket] Disconnected', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false;

        if (
          isMountedRef.current &&
          enabledRef.current &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectAttempts.current++;

          console.debug(
            `[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})...`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && enabledRef.current) {
              connect();
            }
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      isConnectingRef.current = false;
    }
  }, [userId]);

  const sendPing = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'ping' }));
    }
  }, []);

  const acknowledgeNotification = useCallback((notificationId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: 'acknowledge',
          notificationId,
        }),
      );
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const connectTimeout = setTimeout(() => {
      if (isMountedRef.current && userId && enabledRef.current) {
        connect();
      }
    }, 100);

    const pingInterval = setInterval(sendPing, 30000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(connectTimeout);
      clearInterval(pingInterval);
      disconnect();
    };
  }, [userId, disconnect, connect, sendPing]);

  return {
    isConnected,
    lastNotification,
    connect,
    disconnect,
    acknowledgeNotification,
  };
};

/**
 * Combined hook for all notification functionality
 */
export const useNotificationCenter = (userId: string | undefined) => {
  const notifications = useNotifications(userId);
  const unreadCount = useUnreadNotificationCount(userId);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  return {
    notifications: notifications.data?.notifications || [],
    unreadCount: unreadCount.data || 0,
    total: notifications.data?.total || 0,

    isLoading: notifications.isLoading || unreadCount.isLoading,
    isFetching: notifications.isFetching || unreadCount.isFetching,

    markAsRead: (notificationId: string) => {
      if (!userId) return;
      markAsRead.mutate({ userId, notificationId });
    },
    markAllAsRead: () => {
      if (!userId) return;
      markAllAsRead.mutate({ userId });
    },
    deleteNotification: (notificationId: string) => {
      if (!userId) return;
      deleteNotification.mutate({ userId, notificationId });
    },

    refetch: () => {
      notifications.refetch();
      unreadCount.refetch();
    },
  };
};
