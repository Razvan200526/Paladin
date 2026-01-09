import { Button } from '@common/components/button';
import { Toast } from '@common/components/toast';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@ruby/shared/hooks';
import type { Notification } from '../../sdk/NotificationFetcher';
import {
  useNotificationCenter,
  useRealtimeNotifications,
} from './useNotifications';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return notificationDate.toLocaleDateString();
}

const notificationIcons: Record<string, string> = {
  application_status_changed: 'heroicons:arrow-path',
  application_created: 'heroicons:plus-circle',
  application_deleted: 'heroicons:trash',
  resume_uploaded: 'heroicons:document-arrow-up',
  resume_analyzed: 'heroicons:document-magnifying-glass',
  coverletter_uploaded: 'heroicons:document-arrow-up',
  coverletter_analyzed: 'heroicons:document-magnifying-glass',
  interview_scheduled: 'heroicons:calendar',
  interview_reminder: 'heroicons:bell-alert',
  system_announcement: 'heroicons:megaphone',
};

const priorityColors: Record<string, string> = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const icon = notificationIcons[notification.type] || 'heroicons:bell';
  const priorityColor =
    priorityColors[notification.priority] || 'text-gray-500';

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const timeAgo = formatTimeAgo(new Date(notification.createdAt));

  return (
    <div
      className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
        notification.read ? 'bg-transparent' : 'bg-primary/5'
      } hover:bg-primary/10`}
      onClick={handleClick}
    >
      <div className={`shrink-0 ${priorityColor}`}>
        <Icon icon={icon} className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm ${
              notification.read
                ? 'text-secondary-text'
                : 'text-primary font-medium'
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted/70 mt-1">{timeAgo}</p>
      </div>
      <button
        type="button"
        className="shrink-0 p-1 hover:bg-danger/10 rounded transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
      >
        <Icon
          icon="heroicons:x-mark"
          className="size-4 text-muted hover:text-danger"
        />
      </button>
    </div>
  );
};

export const NotificationBell = () => {
  const { data: user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationCenter(user?.id);

  useRealtimeNotifications(user?.id, {
    onNotification: (notification) => {
      Toast.info({
        title: notification.title,
        description: notification.message,
      });
    },
    enabled: !!user?.id,
  });

  const hasUnread = unreadCount > 0;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="relative">
          <Badge
            content={unreadCount > 99 ? '99+' : unreadCount}
            color="danger"
            size="sm"
            isInvisible={!hasUnread}
            placement="top-right"
          >
            {hasUnread ? (
              <BellAlertIcon className="size-5 text-primary" />
            ) : (
              <BellIcon className="size-5" />
            )}
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        className="w-80 max-h-96 overflow-hidden"
        closeOnSelect={false}
      >
        <DropdownSection
          title="Notifications"
          classNames={{
            heading: 'px-2 py-2 text-sm font-semibold',
          }}
        >
          {hasUnread ? (
            <DropdownItem key="mark-all" textValue="Mark all as read">
              <button
                type="button"
                className="text-xs text-primary hover:underline w-full text-right"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </DropdownItem>
          ) : null}
          {isLoading ? (
            <DropdownItem key="loading" textValue="Loading">
              <div className="flex items-center justify-center py-4">
                <Spinner size="sm" />
              </div>
            </DropdownItem>
          ) : notifications.length === 0 ? (
            <DropdownItem key="empty" textValue="No notifications">
              <div className="flex flex-col items-center justify-center py-6 text-muted">
                <Icon icon="heroicons:bell-slash" className="size-8 mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            </DropdownItem>
          ) : (
            <>
              {notifications.slice(0, 10).map((notification) => (
                <DropdownItem
                  key={notification.id}
                  textValue={notification.title}
                  className="p-0"
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                </DropdownItem>
              ))}
              {notifications.length > 10 && (
                <DropdownItem key="view-all" textValue="View all">
                  <div className="text-center py-2">
                    <span className="text-sm text-primary hover:underline">
                      View all {notifications.length} notifications
                    </span>
                  </div>
                </DropdownItem>
              )}
            </>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
