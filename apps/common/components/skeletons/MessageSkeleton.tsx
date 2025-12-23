import { cn, Skeleton } from '@heroui/react';

interface MessageSkeletonProps {
  className?: string;
}

export const MessageSkeleton = ({ className }: MessageSkeletonProps) => {
  return (
    <div className={cn('flex items-center space-x-1 p-3', className)}>
      <Skeleton className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <Skeleton className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <Skeleton className="w-2 h-2 rounded-full animate-bounce" />
    </div>
  );
};
