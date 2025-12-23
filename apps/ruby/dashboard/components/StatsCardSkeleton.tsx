import { Card } from '@common/components/card';

export const StatsCardSkeleton = () => {
  return (
    <Card className="bg-background border-border">
      <div className="space-y-2 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/4 dark:bg-gray-700" />
          <div className="h-6 bg-gray-200 rounded w-1/4 dark:bg-gray-700" />
        </div>
      </div>
    </Card>
  );
};
