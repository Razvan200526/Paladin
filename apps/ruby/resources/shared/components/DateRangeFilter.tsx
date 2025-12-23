import { cn } from '@heroui/react';
import type { DateRangeOption } from '../types';

type DateRangeFilterProps = {
  options: DateRangeOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export const DateRangeFilter = ({
  options,
  selectedValue,
  onSelect,
}: DateRangeFilterProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onSelect(item.value)}
          className={cn(
            'px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200',
            selectedValue === item.value
              ? 'bg-secondary-text/10 border-secondary text-secondary-text'
              : 'bg-transparent border-border/50 text-primary hover:border-border-hover hover:bg-background',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
