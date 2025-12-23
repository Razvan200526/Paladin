import { EyelashClosedIcon } from '@common/icons/EyelashClosedIcon';
import { EyeOpenIcon } from '@common/icons/EyeOpenIcon';
import { PasswordIcon } from '@common/icons/PasswordIcon';
import { isUserPasswordValid } from '@common/validators/isUserPasswordValid';
import { Button, cn } from '@heroui/react';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputPasswordRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputPasswordProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputPasswordRefType | null>;
};

export const InputPassword = ({
  name,
  size,
  placeholder = 'Enter your password',
  label = 'Password',
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
}: InputPasswordProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const icon = (
    <PasswordIcon
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
        return isUserPasswordValid(initialValue);
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.password.required';
        }

        return isUserPasswordValid(initialValue)
          ? ''
          : 'errors.password.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={icon}
      endContent={
        <Button
          size="sm"
          variant="light"
          radius="full"
          isIconOnly={true}
          onPress={() => handleClick()}
        >
          {isVisible ? (
            <EyeOpenIcon className="size-3.5" />
          ) : (
            <EyelashClosedIcon className="size-3.5" />
          )}
        </Button>
      }
      type={isVisible ? 'text' : 'password'}
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
