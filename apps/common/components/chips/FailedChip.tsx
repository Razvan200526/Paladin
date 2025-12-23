import { Chip, cn } from '@heroui/react';

export const FailedChip = ({ className }: { className?: string }) => {
  return (
    <Chip
      size="sm"
      radius="full"
      variant="flat"
      className={cn(
        'text-danger data-[hover=true]:bg-danger/10',
        'bg-danger/15 border-danger',
        'text-[10px] rounded-full w-5 h-5',
        className,
      )}
    >
      <span className="font-xs">Failed</span>
    </Chip>
  );
};
