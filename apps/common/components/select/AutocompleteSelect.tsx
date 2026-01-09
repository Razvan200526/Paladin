import { Autocomplete, type AutocompleteProps, cn } from '@heroui/react';
import { Icon } from '@iconify/react';

export type AutocompleteSelectPropsType = Omit<
  AutocompleteProps,
  'color' | 'variant' | 'onSelectionChange' | 'onChange'
> & {
  variant?: 'faded' | 'flat' | 'bordered';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  inputClassName?: string;
  onChange?: (value: string) => void;
};

export const AutocompleteSelect = (props: AutocompleteSelectPropsType) => {
  const {
    size = 'sm',
    variant = 'bordered',
    color = 'primary',
    inputClassName,
    onChange,
    ...restProps
  } = props;

  const customFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    textValue = textValue.normalize('NFC').toLocaleLowerCase();
    inputValue = inputValue.normalize('NFC').toLocaleLowerCase();

    return textValue.includes(inputValue);
  };

  return (
    <Autocomplete
      disableSelectorIconRotation
      allowsCustomValue
      defaultFilter={customFilter}
      radius="sm"
      isClearable={false}
      aria-label="select"
      maxListboxHeight={350}
      itemHeight={40}
      {...restProps}
      isRequired={props.isRequired || props.required}
      size={size}
      color={color}
      variant={variant}
      labelPlacement="outside"
      selectorIcon={<Icon icon="mi:select" />}
      scrollShadowProps={{
        isEnabled: false,
      }}
      isVirtualized
      inputProps={{
        classNames: {
          base: cn('w-full shadow-none border-none'),
          input: cn(
            'bg-light text-lg font-primary font-medium shadow-none placeholder:font-normal placeholder:text-base',
            'selection:bg-primary selection:text-primary-50 placeholder:text-muted/70 border-none',
            size === 'sm' ? 'text-sm' : 'text-base',
            size === 'sm' ? 'placeholder:text-sm' : 'placeholder:text-base',
            props.isInvalid ? 'placeholder:text-danger-200' : '',
            inputClassName,
          ),
          inputWrapper: cn(
            'border border-border-hover rounded relative shadow-none data-[hover=true]:border-primary',
            'flex items-center gap-2',
          ),
          label: cn(
            'font-primary font-semibold',
            size === 'sm' ? 'text-sm' : 'text-md',
          ),
        },
      }}
      listboxProps={{
        hideSelectedIcon: false,
        itemClasses: {
          base: [
            'rounded',
            'text-primary',
            'data-[selectable=true]:focus:bg-primary-50',
            'data-[selectable=true]:focus:text-primary',
            'data-[hover=true]:text-primary',
            'data-[hover=true]:bg-hover',
            'data-[focus-visible=true]:ring-primary',
          ],
        },
      }}
      popoverProps={{
        classNames: {
          base: 'bg-light rounded shadow-none border border-primary p-1',
          content: 'rounded-none shadow-none p-0',
        },
      }}
      onSelectionChange={(value: any) => onChange?.(value)}
    />
  );
};
