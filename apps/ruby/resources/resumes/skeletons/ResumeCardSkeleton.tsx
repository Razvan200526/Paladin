import { Skeleton } from '@heroui/react';

export const ResumeCardSkeleton = () => {
  return (
    <Skeleton className="h-[250px] rounded relative flex flex-col border border-border transition-all duration-300 hover:border-border-hover ease-in-out w-full">
      <div className="h-full w-full rounded flex items-center justify-center" />
    </Skeleton>
  );
};
