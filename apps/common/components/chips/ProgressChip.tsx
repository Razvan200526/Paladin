import { ProgressIcon } from '@common/icons/ProgressIcon';
import { Chip, cn } from '@heroui/react';
import type { ReactNode } from 'react';

type ProgressChipProps = {
  children: ReactNode;
  className?: string;
};

export const ProgressChip = ({ children, className }: ProgressChipProps) => {
  return (
    <Chip
      size="sm"
      color="primary"
      variant="flat"
      className={cn('border border-info bg-info/20 text-info', className)}
      startContent={<ProgressIcon className="size-3 text-info" />}
    >
      {children}
    </Chip>
  );
};
