import { H6 } from '@common/components/typography';
import { cn } from '@heroui/react';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center ">
      <div className="flex items-center mt-2">
        <Icon className={cn('size-3.5 mr-2', className)} />
        <H6 className={cn('text-base', className)}>{title}</H6>
      </div>
      <p className="text-sm text-muted max-w-md">{description}</p>
      {action && action}
    </div>
  );
};
