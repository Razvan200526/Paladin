import { SuccessIcon } from '@common/icons/SuccessIcon';
import { Chip, cn } from '@heroui/react';
import type { ReactNode } from 'react';

type SuccessChipProps = {
  children: ReactNode;
  className?: string;
};

export const SuccessChip = ({ children, className }: SuccessChipProps) => {
  return (
    <Chip
      size="sm"
      color="success"
      variant="flat"
      className={cn('border border-success', className)}
      startContent={<SuccessIcon className="size-3" />}
    >
      {children}
    </Chip>
  );
};
