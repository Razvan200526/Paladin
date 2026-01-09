import { Globe } from 'lucide-react';
import { AutocompleteItem } from '@heroui/react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import { PLATFORM_OPTIONS } from './constants';
import styles from './Selector.module.css';

export const PlatformSelector = (
  props: Omit<AutocompleteSelectPropsType, 'items' | 'children'>,
) => {
  const [startContent, setStartContent] = useState(
    <Globe className="size-4 text-primary" />,
  );

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={PLATFORM_OPTIONS.map((platform) => ({
        key: platform.value,
        label: platform.label,
        category: platform.category,
        icon: platform.icon,
      }))}
      startContent={startContent}
      onChange={(value) => {
        const field = PLATFORM_OPTIONS.find((f) => f.value === value);

        if (field) {
          setStartContent(<field.icon className="size-3.5 text-primary" />);
        } else {
          setStartContent(<Globe className="size-3.5 text-primary" />);
        }

        props.onChange?.(value);
      }}
    >
      {(field: any) => (
        <AutocompleteItem key={field.key} textValue={field.label}>
          <span className="flex flex-row items-center gap-2">
            <field.icon className="size-3.5" />
            <span className="truncate font-medium text-sm">{field.label}</span>
          </span>
        </AutocompleteItem>
      )}
    </AutocompleteSelect>
  );
};
