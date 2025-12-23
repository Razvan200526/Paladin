import { cn, Tooltip as HeroTooltip, type TooltipProps } from '@heroui/react';

export const Tooltip = (props: Omit<TooltipProps, 'closeDelay' | 'radius'>) => {
  return (
    <HeroTooltip
      offset={15}
      {...props}
      closeDelay={100}
      radius="sm"
      className={cn(
        'font-medium text-primary rounded shadow-lg',
        props.className,
      )}
    />
  );
};
