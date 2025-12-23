import { SearchIcon } from '@common/icons/SearchIcon';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputEmailRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  // getErrorMessage: () => string;
};

export type InputEmailProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  hasLabel?: boolean;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputEmailRefType | null>;
};

export const InputSearch = ({
  name,
  size,
  placeholder = '',
  label = 'Search',
  hasLabel,
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
}: InputEmailProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const icon = (
    <SearchIcon
      color={isFocused || initialValue.length > 0 ? '#007ab7' : '#97caea'}
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
        return true;
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={icon}
      type="search"
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
