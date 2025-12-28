import { Button } from '@common/components/button';
import { MessageIcon } from '@common/icons/MessageIcon';
import { StopIcon } from '@heroicons/react/20/solid';
import { cn, Input as HeroInput } from '@heroui/react';
import { SendIcon } from 'lucide-react';
import { useImperativeHandle, useState } from 'react';

export type InputChatRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
  submit: () => void;
};

export type InputChatProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  value?: string;
  className?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  ref?: React.RefObject<InputChatRefType | null>;
  isPending?: boolean;
  theme?: 'resume' | 'coverletter' | 'portfolio' | 'default';
  showStopButton?: boolean;
};

type ThemeColorsType = {
  default: {
    text: string;
    placeholder: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    button: string;
  };
  resume: {
    text: string;
    placeholder: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    button: string;
  };
  coverletter: {
    text: string;
    placeholder: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    button: string;
  };
  portfolio: {
    text: string;
    placeholder: string;
    border: string;
    borderHover: string;
    borderFocus: string;
    button: string;
  };
};

export const InputChat = ({
  name,
  size = 'sm',
  placeholder,
  value,
  className,
  inputClassName,
  inputWrapperClassName,
  onChange,
  onSubmit,
  onStop,
  ref,
  isPending,
  theme = 'default',
  showStopButton = false,
}: InputChatProps) => {
  const [inputValue, setInputValue] = useState(value || '');

  const themeColors: ThemeColorsType = {
    default: {
      text: 'text-primary',
      placeholder: 'placeholder-primary/50',
      border: 'border-primary/20',
      borderHover: 'data-[hover=true]:border-primary',
      borderFocus: 'data-[focus=true]:border-primary',
      button: 'text-primary',
    },
    resume: {
      text: 'text-resume',
      placeholder: 'placeholder-resume/50',
      border: 'border-resume/20',
      borderHover: 'data-[hover=true]:border-resume',
      borderFocus: 'data-[focus=true]:border-resume',
      button: 'text-resume',
    },
    coverletter: {
      text: 'text-coverletter',
      placeholder: 'placeholder-coverletter/50',
      border: 'border-coverletter/20',
      borderHover: 'data-[hover=true]:border-coverletter',
      borderFocus: 'data-[focus=true]:border-coverletter',
      button: 'text-coverletter',
    },
    portfolio: {
      text: 'text-portfolio',
      placeholder: 'placeholder-portfolio/50',
      border: 'border-portfolio/20',
      borderHover: 'data-[hover=true]:border-portfolio',
      borderFocus: 'data-[focus=true]:border-portfolio',
      button: 'text-portfolio',
    },
  };

  const colors = themeColors[theme] || themeColors.default;

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return inputValue;
      },
      setValue(value: string) {
        setInputValue(value);
      },
      clear() {
        setInputValue('');
      },
      submit() {
        if (inputValue.trim()) {
          onSubmit?.(inputValue);
        }
      },
    };
  }, [inputValue, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!showStopButton && inputValue.trim()) {
        onSubmit?.(inputValue);
      }
    }
  };

  const handleSendClick = () => {
    if (isPending) {
      onStop?.();
    } else if (inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  };

  return (
    <HeroInput
      name={name}
      type="text"
      size="md"
      radius="lg"
      variant="bordered"
      autoComplete="off"
      placeholder={placeholder}
      value={inputValue}
      onKeyDown={handleKeyDown}
      startContent={
        <MessageIcon className={cn('size-4', colors.text)} />
      }
      endContent={
        showStopButton ? (
          <Button
            size="sm"
            isIconOnly
            className="rounded-md"
            variant="bordered"
            onPress={onStop}
            startContent={
              <StopIcon className="size-3.5 text-secondary-text" />
            }
          />
        ) : (
          <Button
            type="button"
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            isDisabled={!inputValue.trim()}
            className={colors.button}
            onPress={handleSendClick}
          >
            <SendIcon className="size-4" />
          </Button>
        )
      }
      classNames={{
        base: cn('w-full border-none shadow-none', className),
        input: [
          'bg-light font-medium shadow-none placeholder:font-normal',
          'selection:bg-primary selection:text-primary-50 border-none',
          size === 'sm' ? 'text-sm' : 'text-base',
          size === 'sm' ? 'placeholder:text-xs' : 'placeholder:text-sm',
          colors.text,
          colors.placeholder,
          'font-semibold',
          inputClassName,
        ],
        inputWrapper: cn(
          'relative rounded-xl border bg-light shadow-none',
          'flex items-center gap-2 px-3 py-2',
          colors.border,
          colors.borderHover,
          colors.borderFocus,
          inputWrapperClassName,
        ),
      }}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange?.(e.target.value);
      }}
    />
  );
};

InputChat.displayName = 'InputChat';
