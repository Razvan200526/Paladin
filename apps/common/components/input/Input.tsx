import { Input as HeroInput, type InputProps } from '@heroui/input';
import { cn } from '@heroui/theme';

export type InputPropsType = Omit<
  InputProps,
  'variant' | 'radius' | 'size' | 'onChange'
> & {
  size?: 'sm' | 'md';
  iconClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
  onChange?: (value: string) => void;
};

export const Input = (props: InputPropsType) => {
  const {
    size = 'sm',
    className,
    color = 'primary',
    inputClassName,
    inputWrapperClassName,
    onChange,
    ...rest
  } = props;

  return (
    <HeroInput
      type="text"
      color={color}
      variant="bordered"
      {...rest}
      size={size}
      isRequired={props.isRequired || props.required}
      radius="sm"
      labelPlacement="outside"
      autoComplete="off"
      classNames={{
        base: cn('w-full border-none shadow-none', className),
        input: [
          'bg-background text-lg font-primary font-medium shadow-none placeholder:font-normal placeholder:text-xs',
          'selection:bg-background selection:text-primary-50 placeholder:text-muted/70 border-none',
          size === 'sm' ? 'text-sm' : 'text-base',
          size === 'sm' ? 'placeholder:text-xs' : 'placeholder:text-sm',
          props.isInvalid ? 'placeholder:text-danger-200' : '',
          inputClassName,
        ],
        inputWrapper: cn(
          'relative rounded border border-border shadow-none data-[hover=true]:transition-all data-[hover=true]:duration-150 data-[hover=true]:ease-in data-[hover=true]:border-border-hover',
          'flex items-center gap-2',
          inputWrapperClassName,
        ),
        label: cn(
          'font-primary font-semibold',
          size === 'sm' ? 'text-sm' : 'text-md',
        ),
      }}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
    />
  );
};
