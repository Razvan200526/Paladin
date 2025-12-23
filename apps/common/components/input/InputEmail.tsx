import { EmailIcon } from '@common/icons/EmailIcon';
import { isEmailValid } from '@common/validators/isEmailValid';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputEmailRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputEmailProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputEmailRefType | null>;
  hasIcon?: boolean;
  hasLabel?: boolean;
};

export const InputEmail = ({
  name,
  size,
  placeholder = 'Enter your email',
  label = 'Email',
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
  hasIcon = true,
  hasLabel = true,
}: InputEmailProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const icon = (
    <EmailIcon
      className={cn(
        'size-4.5',
        isFocused || initialValue.length > 0
          ? 'text-primary'
          : 'text-primary-400',
      )}
    />
  );

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return initialValue;
      },
      setValue(value: string) {
        setValue(value);
      },
      isValid() {
        return isEmailValid(initialValue);
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.email.required';
        }

        return isEmailValid(initialValue) ? '' : 'errors.email.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={hasIcon ? icon : undefined}
      type="email"
      placeholder={placeholder}
      label={hasLabel ? label : undefined}
      className={className}
      value={initialValue}
      isRequired={isRequired || required}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(value) => {
        setValue(value);
        onChange?.(value);
      }}
    />
  );
};
