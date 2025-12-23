import { KeyboardIcon } from '@common/icons/KeyboardIcon';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputTextRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputTextProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputTextRefType | null>;
  icon?: React.ReactNode;
  hasIcon?: boolean;
  hasLabel?: boolean;
};

export const InputText = ({
  name,
  size,
  placeholder,
  label,
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
  icon,
  hasIcon = true,
  hasLabel = true,
}: InputTextProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const iconContent = icon || (
    <KeyboardIcon
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
        return initialValue.trim() !== '';
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.text.required';
        }

        return '';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={hasIcon ? iconContent : undefined}
      type="text"
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
