import { Card } from '@common/components/card';
import { cn } from '@heroui/react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatsCard = ({
  label,
  value,
  change,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        'bg-light border-border hover:border-border-hover transition-all duration-200 cursor-pointer group',
        className,
      )}
    >
      <div className="space-y-3">
        <span className="text-sm font-medium text-secondary-text">{label}</span>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-bold text-primary tracking-tight">
            {value}
          </span>
          {change && (
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-200',
                trend === 'up'
                  ? 'text-success-600 bg-success-50'
                  : 'text-danger-600 bg-danger-50',
              )}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
