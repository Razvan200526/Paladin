import { JobIcon } from '@common/icons/JobIcon';
import { AutocompleteItem } from '@heroui/react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import { JOB_PROFESSIONS } from './constants';
import styles from './Selector.module.css';
export const ProfessionSelector = (
  props: Omit<AutocompleteSelectPropsType, 'items' | 'children'>,
) => {
  const [startContent, setStartContent] = useState(
    <JobIcon className="size-4 text-primary" />,
  );

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={JOB_PROFESSIONS.map((profession) => ({
        key: profession.value,
        label: profession.label,
        category: profession.category,
        icon: profession.icon,
      }))}
      startContent={startContent}
      onChange={(value) => {
        const field = JOB_PROFESSIONS.find((f) => f.value === value);

        if (field) {
          setStartContent(<field.icon className="size-3.5 text-primary" />);
        } else {
          setStartContent(<JobIcon className="size-3.5 text-primary" />);
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
