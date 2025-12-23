import { cn } from '@heroui/react';
import type { StateOption } from '../types';

type StateFilterProps = {
  options: StateOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export const StateFilter = ({
  options,
  selectedValue,
  onSelect,
}: StateFilterProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((item) => {
        const isSelected = selectedValue === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            className={cn(
              'w-full px-3 py-2.5 text-xs font-medium rounded-lg border flex items-center gap-2.5 transition-all duration-200',
              isSelected
                ? 'bg-primary-100 border-primary-300 text-primary'
                : 'bg-transparent border-border/50 text-primary-600 hover:border-primary-300 hover:bg-primary-50',
            )}
          >
            <div
              className={cn('size-2 rounded-full', item.color || 'bg-primary')}
            />
            {item.label}
            {isSelected && (
              <div className="ml-auto size-4 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="size-2.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
