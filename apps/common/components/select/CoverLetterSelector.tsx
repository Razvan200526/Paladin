import { AutocompleteItem } from '@heroui/react';
import { FileText, Mail } from 'lucide-react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import styles from './Selector.module.css';

interface CoverLetterSelectorProps
  extends Omit<AutocompleteSelectPropsType, 'items' | 'children'> {
  coverLetters?: Array<{ id: string; name: string }>;
}

export const CoverLetterSelector = ({
  coverLetters = [],
  ...props
}: CoverLetterSelectorProps) => {
  const [startContent, setStartContent] = useState(
    <Mail className="size-4 text-primary" />,
  );

  const coverLetterItems = [
    { key: 'none', label: 'None', value: 'none' },
    ...coverLetters.map((coverLetter) => ({
      key: coverLetter.id,
      label: coverLetter.name,
      value: coverLetter.id,
    })),
  ];

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={coverLetterItems}
      startContent={startContent}
      onChange={(value) => {
        if (value && value !== 'none') {
          setStartContent(<FileText className="size-3.5 text-primary" />);
        } else {
          setStartContent(<Mail className="size-3.5 text-primary" />);
        }

        props.onChange?.(value);
      }}
    >
      {(item: any) => (
        <AutocompleteItem key={item.key} textValue={item.label}>
          <span className="flex flex-row items-center gap-2">
            {item.value === 'none' ? (
              <Mail className="size-3.5" />
            ) : (
              <FileText className="size-3.5" />
            )}
            <span className="truncate font-medium text-sm">{item.label}</span>
          </span>
        </AutocompleteItem>
      )}
    </AutocompleteSelect>
  );
};
