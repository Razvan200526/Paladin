import { InputOtp, type InputOtpProps } from '@heroui/react';

export type InputOTPPropsType = Omit<
  InputOtpProps,
  'variant' | 'radius' | 'size' | 'length'
> & {
  size?: 'sm' | 'md';
  length?: number;
};

export const InputOTP = (props: InputOTPPropsType) => {
  const { size = 'md', color = 'primary', ...rest } = props;

  return (
    <InputOtp
      color={color}
      length={6}
      {...rest}
      size={size}
      isRequired={props.isRequired || props.required}
      radius="sm"
      variant="bordered"
      classNames={{
        segment: [
          'rounded',
          'font-number',
          'bg-transparent border',
          props.isInvalid ? 'border-danger' : 'border-border-hover',
          props.isInvalid
            ? 'data-[active=true]:border-danger'
            : 'data-[active=true]:border-primary',
        ],
      }}
    />
  );
};
