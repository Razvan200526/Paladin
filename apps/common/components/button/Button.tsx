import { type ButtonProps, cn, Button as HeroButton } from '@heroui/react';

export type ButtonPropsType = Omit<ButtonProps, 'color'> & {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

export const Button = (props: ButtonPropsType) => {
  const {
    className,
    children,
    size = 'sm',
    variant = 'solid',
    color = 'primary',
    ...rest
  } = props;

  return (
    <HeroButton
      size={size}
      radius="sm"
      {...rest}
      color={color}
      variant={variant}
      className={cn(
        'font-medium tracking-wide rounded',
        'data-[focus=true]:outline-2 data-[focus=true]:outline-offset-2',
        'data-[focus=true]:outline-primary',
        size === 'sm' ? 'text-xs' : 'text-sm',
        variant === 'bordered' ? 'border-small' : '',
        color === 'primary' && variant === 'light'
          ? 'data-[hover=true]:bg-primary-100'
          : '',
        color === 'primary' && variant === 'flat' ? 'text-primary' : '',
        className,
      )}
    >
      {children}
    </HeroButton>
  );
};
