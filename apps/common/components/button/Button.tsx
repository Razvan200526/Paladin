import { type ButtonProps, Button as HeroButton } from '@heroui/button';
import { cn } from '@heroui/theme';

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
