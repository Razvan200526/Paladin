import { PhoneIcon } from '@common/icons/PhoneIcon';
import { isPhoneValid } from '@common/validators/isPhoneValid';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputPhoneRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputPhoneProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputPhoneRefType | null>;
  icon?: React.ReactNode;
  hasIcon?: boolean;
  hasLabel?: boolean;
};

export const InputPhone = ({
  name,
  size,
  placeholder = '+1 (555) 123-4567',
  label = 'Phone Number',
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
  icon,
  hasIcon = true,
  hasLabel = true,
}: InputPhoneProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const iconContent = icon || (
    <PhoneIcon
      className={cn(
        'size-4.5',
        isFocused || initialValue.length > 0
          ? 'text-primary'
          : 'text-border-hover',
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
        return isPhoneValid(initialValue);
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.phone.required';
        }

        return isPhoneValid(initialValue) ? '' : 'errors.phone.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={hasIcon ? iconContent : undefined}
      type="tel"
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
