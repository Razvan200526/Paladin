import { Button } from '@common/components/button';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Icon } from '@iconify/react';
import { clsx as cn } from 'clsx';
import type { Notification } from '../../sdk/NotificationFetcher';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const typeConfig: Record<
  Notification['type'],
  { icon: string; color: string; bgColor: string }
> = {
  application_status_changed: {
    icon: 'heroicons:arrow-path',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  application_created: {
    icon: 'heroicons:document-plus',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  application_deleted: {
    icon: 'heroicons:trash',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  resume_uploaded: {
    icon: 'heroicons:document-arrow-up',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  resume_analyzed: {
    icon: 'heroicons:sparkles',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  coverletter_uploaded: {
    icon: 'heroicons:document-text',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  coverletter_analyzed: {
    icon: 'heroicons:sparkles',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  interview_scheduled: {
    icon: 'heroicons:calendar',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  interview_reminder: {
    icon: 'heroicons:bell-alert',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  system_announcement: {
    icon: 'heroicons:megaphone',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};

const priorityConfig: Record<
  Notification['priority'],
  { borderColor: string; badge?: string }
> = {
  low: { borderColor: 'border-l-gray-300' },
  medium: { borderColor: 'border-l-blue-400' },
  high: { borderColor: 'border-l-amber-500', badge: 'Important' },
  urgent: { borderColor: 'border-l-red-500', badge: 'Urgent' },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return notificationDate.toLocaleDateString();
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: NotificationItemProps) => {
  const typeInfo =
    typeConfig[notification.type] || typeConfig.system_announcement;
  const priorityInfo =
    priorityConfig[notification.priority] || priorityConfig.medium;

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 border-l-4 transition-colors cursor-pointer',
        'hover:bg-light/50',
        notification.read ? 'bg-background' : 'bg-light',
        priorityInfo.borderColor,
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          typeInfo.bgColor,
        )}
      >
        <Icon icon={typeInfo.icon} className={cn('size-5', typeInfo.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  'text-sm font-medium truncate',
                  notification.read ? 'text-muted' : 'text-primary',
                )}
              >
                {notification.title}
              </h4>
              {priorityInfo.badge && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded font-medium',
                    notification.priority === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700',
                  )}
                >
                  {priorityInfo.badge}
                </span>
              )}
            </div>
            <p
              className={cn(
                'text-sm mt-0.5 line-clamp-2',
                notification.read ? 'text-muted' : 'text-secondary-text',
              )}
            >
              {notification.message}
            </p>
            <span className="text-xs text-muted mt-1 block">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && onMarkAsRead && (
          <Button
            variant="light"
            size="sm"
            isIconOnly
            onPress={() => onMarkAsRead(notification.id)}
            className="size-7"
            title="Mark as read"
          >
            <CheckIcon className="size-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="light"
            size="sm"
            isIconOnly
            color="danger"
            onPress={() => onDelete(notification.id)}
            className="size-7"
            title="Delete"
          >
            <TrashIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
