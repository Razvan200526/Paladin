import { PdfIcon } from '@common/icons/PdfIcon';
import { isNameValid } from '@common/validators/isNameValid';
import { cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputFileNameRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputFileNameProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputFileNameRefType | null>;
};

export const InputFileName = ({
  name,
  size,
  placeholder = 'Enter file name',
  label = 'File Name',
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
}: InputFileNameProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const icon = (
    <PdfIcon
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
          return 'errors.fileName.required';
        }

        return isNameValid(initialValue)
          ? ''
          : 'errors.fileName.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={icon}
      type="text"
      placeholder={placeholder}
      label={label}
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
