import { ProfileIcon } from '@common/icons/ProfileIcon';
import { isNameValid } from '@common/validators/isNameValid';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputNameRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputNameProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<InputNameRefType | null>;
  icon?: React.ReactNode;
  hasIcon?: boolean;
  hasLabel?: boolean;
  type?: string;
  disabled?: boolean;
};

export const InputName = ({
  name,
  size,
  placeholder = 'Enter your first name',
  label = 'First Name',
  value,
  required,
  isRequired,
  className,
  onChange,
  onKeyDown,
  ref,
  icon,
  hasIcon,
  hasLabel = true,
  type = 'text',
  disabled,
}: InputNameProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const iconContent = icon || (
    <ProfileIcon
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
        return isNameValid(initialValue);
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.firstName.required';
        }

        return isNameValid(initialValue)
          ? ''
          : 'errors.firstName.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={hasIcon ? iconContent : undefined}
      type={type}
      placeholder={placeholder}
      label={hasLabel ? label : undefined}
      className={className}
      value={initialValue}
      isRequired={isRequired || required}
      isDisabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={onKeyDown}
      onChange={(value) => {
        setValue(value);
        onChange?.(value);
      }}
    />
  );
};
