import { LocationIcon } from '@common/icons/LocationIcon';
import { AutocompleteItem } from '@heroui/react';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import { LOCATION_OPTIONS } from './constants';
import styles from './Selector.module.css';

export const LocationSelect = (
  props: Omit<AutocompleteSelectPropsType, 'items' | 'children'>,
) => {
  const [startContent, setStartContent] = useState(
    <LocationIcon className="size-4 text-primary" />,
  );

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={LOCATION_OPTIONS.map((location) => ({
        key: location.value,
        label: location.label,
        category: location.category,
        icon: location.icon,
      }))}
      startContent={startContent}
      onChange={(value) => {
        const field = LOCATION_OPTIONS.find((f) => f.value === value);

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
