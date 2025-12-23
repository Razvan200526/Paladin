import { formatRelativeNumber } from '@common/utils';
import { Chip, cn } from '@heroui/react';

type NumberChipProps = {
  value: number;
  className?: string;
};

export const NumberChip = ({ value, className }: NumberChipProps) => {
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
      <span className="font-semibold">{formatRelativeNumber(value)}</span>
    </Chip>
  );
};
