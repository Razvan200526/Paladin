import { cn } from '@heroui/react';

const SkeletonItem = () => (
  <div className="flex items-center gap-2 px-3 py-2">
    <div className="h-4 w-4 rounded-sm bg-secondary/10" />
    <div className="h-4 flex-1 rounded-sm bg-secondary/10" />
  </div>
);

const SkeletonGroup = () => (
  <div className="space-y-2">
    <div className="h-3 w-1/3 rounded-sm bg-secondary/10" />
    <div className="space-y-1">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  </div>
);

export const ChatHistorySkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('animate-pulse space-y-5 p-2', className)}>
      <SkeletonGroup />
      <SkeletonGroup />
    </div>
  );
};
