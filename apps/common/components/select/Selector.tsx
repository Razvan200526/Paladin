import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem, type SelectProps } from '@heroui/react';
import { useMemo } from 'react';
import styles from './Selector.module.css';

export interface SelectorItem {
  value: string;
  label: string;
  startContent?: React.ReactNode;
}

type SelectItemClassNames = React.ComponentProps<
  typeof SelectItem
>['classNames'];

interface CustomSelectorProps
  extends Omit<SelectProps, 'children' | 'items' | 'onChange'> {
  items: SelectorItem[] | string[];
  onChange?: (value: string) => void;
  value?: string;
  itemClassNames?: SelectItemClassNames;
}

export const Selector = ({
  items,
  onChange,
  value,
  ...props
}: CustomSelectorProps) => {
  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item };
      }
      return item;
    });
  }, [items]);

  return (
    <Select
      aria-label="selector"
      selectedKeys={value ? new Set([value]) : undefined}
      color="primary"
      variant="flat"
      size="sm"
      radius="sm"
      style={{
        background: 'var(--color-background)',
        cursor: 'pointer',
      }}
      selectorIcon={<ChevronUpDownIcon className="size-3.5" />}
      classNames={{
        trigger:
          'border border-border hover:transition-all hover:duration-150 hover:ease-in-out hover:border-border-hover',
        value: 'text-primary',
        popoverContent: 'bg-background border border-border',
        listbox: 'text-primary',
      }}
      {...props}
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        if (onChange) {
          onChange(selectedValue || '');
        }
      }}
    >
      {normalizedItems.map((item) => (
        <SelectItem
          color="primary"
          variant="flat"
          key={item.value}
          startContent={item.startContent}
          className={styles.heroBg}
          classNames={{
            base: 'hover:bg-background group-hover:transition-all group-hover:duration-150 group-hover:ease-in group-hover:text-secondary-text',
            title:
              'group-selected:text-secondary-text group-hover:text-secondary-text',
            selectedIcon: 'text-secondary-text',
          }}
        >
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};
