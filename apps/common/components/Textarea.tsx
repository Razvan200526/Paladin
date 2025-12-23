import type { TextAreaProps } from '@heroui/react';
import { cn, Textarea as NextTextarea } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';

export type TextareaRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type TextareaProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
  minRows?: TextAreaProps['minRows'];
  maxRows?: TextAreaProps['maxRows'];
  submitOnEnter?: boolean;
  onSubmit?: (value: string) => void;
  ref?: React.RefObject<TextareaRefType | null>;
};

export const Textarea = ({
  name,
  size,
  placeholder,
  label,
  value,
  required,
  isRequired,
  className,
  wrapperClassName,
  inputClassName,
  onChange,
  submitOnEnter,
  onSubmit,
  ref,
  ...props
}: TextareaProps) => {
  const [initialValue, setValue] = useState(value || '');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (submitOnEnter && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit?.(initialValue);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return initialValue;
      },
      setValue(value: string) {
        setValue(value);
      },
      isValid() {
        return initialValue.trim().length > 0;
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.textarea.required';
        }
        return '';
      },
    };
  }, [initialValue]);

  return (
    <NextTextarea
      radius="sm"
      labelPlacement="outside"
      name={name}
      size={size}
      placeholder={placeholder}
      className={className}
      value={initialValue}
      isRequired={isRequired || required}
      {...props}
      label={undefined}
      classNames={{
        base: 'w-full',
        input: [
          'min-h-[20px] placeholder:italic placeholder:text-xs',
          'bg-light font-medium placeholder:text-muted/70',
          'selection:bg-primary selection:text-primary-50 placeholder:font-normal',
          inputClassName,
        ],
        inputWrapper: [
          'border rounded data-[hover=true]:border-border-hover',
          'border-border-hover',
          wrapperClassName,
        ],
        label: cn(
          'font-primary text-primary font-semibold rounded-none',
          size === 'sm' ? 'text-sm' : 'text-base',
        ),
        description: cn(
          'font-primary text-primary font-semibold',
          size === 'sm' ? 'text-sm' : 'text-base',
        ),
      }}
      variant="bordered"
      onValueChange={(value) => {
        setValue(value);
        onChange?.(value);
      }}
      onKeyDown={handleKeyDown}
    />
  );
};
