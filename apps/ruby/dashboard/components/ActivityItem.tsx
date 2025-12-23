import { cn } from '@heroui/react';

interface ActivityItemProps {
  action: string;
  time: string;
  type: 'application' | 'interview' | 'response' | 'resource';
  className?: string;
}

export const ActivityItem = ({
  action,
  time,
  type,
  className,
}: ActivityItemProps) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'application':
        return {
          dot: 'bg-primary-400',
          bg: 'bg-primary-50/50',
          border: 'border-primary-100',
        };
      case 'interview':
        return {
          dot: 'bg-success-400',
          bg: 'bg-success-50/50',
          border: 'border-success-100',
        };
      case 'response':
        return {
          dot: 'bg-secondary-400',
          bg: 'bg-secondary-50/50',
          border: 'border-secondary-100',
        };
      case 'resource':
        return {
          dot: 'bg-info-400',
          bg: 'bg-info-50/50',
          border: 'border-info-100',
        };
      default:
        return {
          dot: 'bg-primary-300',
          bg: 'bg-primary-50/30',
          border: 'border-primary-100',
        };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors duration-200',
        styles.bg,
        styles.border,
        'hover:border-border-hover',
        className,
      )}
    >
      <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', styles.dot)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary leading-snug line-clamp-2">
          {action}
        </p>
        <p className="text-xs text-secondary-text mt-0.5">{time}</p>
      </div>
    </div>
  );
};
