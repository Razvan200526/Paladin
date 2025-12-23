import { cn } from '@heroui/react';

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-light p-4 shadow-none border border-primary-100 w-full',
        className,
      )}
    >
      {children}
    </div>
  );
};
