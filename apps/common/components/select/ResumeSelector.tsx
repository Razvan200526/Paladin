import { AutocompleteItem } from '@heroui/react';
import { File, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import styles from './Selector.module.css';

interface ResumeSelectorProps
  extends Omit<AutocompleteSelectPropsType, 'items' | 'children'> {
  resumes?: Array<{ id: string; name: string }>;
}

export const ResumeSelector = ({
  resumes = [],
  ...props
}: ResumeSelectorProps) => {
  const [startContent, setStartContent] = useState(
    <FileText className="size-4 text-primary" />,
  );

  const resumeItems = [
    { key: 'none', label: 'None', value: 'none' },
    ...resumes.map((resume) => ({
      key: resume.id,
      label: resume.name,
      value: resume.id,
    })),
  ];

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      defaultItems={resumeItems}
      startContent={startContent}
      onChange={(value) => {
        if (value && value !== 'none') {
          setStartContent(<File className="size-3.5 text-primary" />);
        } else {
          setStartContent(<FileText className="size-3.5 text-primary" />);
        }

        props.onChange?.(value);
      }}
    >
      {(item: any) => (
        <AutocompleteItem key={item.key} textValue={item.label}>
          <span className="flex flex-row items-center gap-2">
            {item.value === 'none' ? (
              <FileText className="size-3.5" />
            ) : (
              <File className="size-3.5" />
            )}
            <span className="truncate font-medium text-sm">{item.label}</span>
          </span>
        </AutocompleteItem>
      )}
    </AutocompleteSelect>
  );
};
