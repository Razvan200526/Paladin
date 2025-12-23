import { Chip, cn } from '@heroui/react';

type NumberChipSkeletonProps = {
  className?: string;
};

export const NumberChipSkeleton = ({ className }: NumberChipSkeletonProps) => {
  return (
    <Chip
      size="sm"
      radius="full"
      variant="flat"
      className={cn(
        'text-primary data-[hover=true]:bg-primary/10',
        'bg-primary/15 border-primary',
        'text-[10px] rounded-full w-5 h-5',
        className,
      )}
    >
      <div className="w-2 h-2 bg-primary/30 rounded-full" />
    </Chip>
  );
};
