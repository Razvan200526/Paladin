import { CheckCircle2 } from 'lucide-react';
import { AutocompleteItem } from '@heroui/react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import { STATUS_OPTIONS } from './constants';
import styles from './Selector.module.css';

export const StatusSelector = (
  props: Omit<AutocompleteSelectPropsType, 'items' | 'children'>,
) => {
  const [startContent, setStartContent] = useState(
    <CheckCircle2 className="size-4 text-primary" />,
  );

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={STATUS_OPTIONS.map((status) => ({
        key: status.value,
        label: status.label,
        category: status.category,
        icon: status.icon,
      }))}
      startContent={startContent}
      onChange={(value) => {
        const field = STATUS_OPTIONS.find((f) => f.value === value);

        if (field) {
          setStartContent(<field.icon className="size-3.5 text-primary" />);
        } else {
          setStartContent(<CheckCircle2 className="size-3.5 text-primary" />);
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
