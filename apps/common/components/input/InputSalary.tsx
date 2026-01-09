import { cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useImperativeHandle, useState } from 'react';
import { H6 } from '../typography';
import { Input } from './Input';
import 'flag-icons/css/flag-icons.min.css';
import { CurrencySelector } from '../select/CurrencySelector';

export type InputSalaryRefType = {
  getValue: () => { min: string; max: string; currency: string };
  setValue: (value: string, pos: 0 | 1) => void;
  setCurrency: (currency: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputSalaryProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholderMin?: string;
  placeholderMax?: string;
  label?: string;
  values?: [string, string];
  currency?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: { min: string; max: string; currency: string }) => void;
  ref?: React.RefObject<InputSalaryRefType | null>;
};

const isRangeValid = (range: [string, string]) => {
  const [min, max] = range;
  if (!min.trim() || !max.trim()) return false;

  const minNum = Number.parseFloat(min.replace(/[$,]/g, ''));
  const maxNum = Number.parseFloat(max.replace(/[$,]/g, ''));

  return !Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum <= maxNum;
};

export const InputSalary = ({
  name,
  size,
  placeholderMin = '50,000',
  placeholderMax = '100,000',
  values,
  currency: initialCurrency = 'USD',
  className,
  onChange,
  ref,
}: InputSalaryProps) => {
  const [salaryRange, setSalaryRange] = useState<[string, string]>(
    values || ['', ''],
  );
  const [currency, setCurrencyState] = useState(initialCurrency);
  const [isFocusedMin, setIsFocusedMin] = useState(false);
  const [isFocusedMax, setIsFocusedMax] = useState(false);

  const iconMin = (
    <Icon
      icon="heroicons:banknotes"
      className={cn(
        'size-4.5',
        isFocusedMin || salaryRange[0].length > 0
          ? 'text-primary'
          : 'text-border-hover',
      )}
    />
  );

  const iconMax = (
    <Icon
      icon="heroicons:banknotes"
      className={cn(
        'size-4.5',
        isFocusedMax || salaryRange[1].length > 0
          ? 'text-primary'
          : 'text-border-hover',
      )}
    />
  );

  useImperativeHandle(
    ref,
    () => ({
      getValue() {
        return {
          min: salaryRange[0],
          max: salaryRange[1],
          currency,
        };
      },
      setValue(value: string, idx: 0 | 1) {
        setSalaryRange((prev) => {
          const newValues: [string, string] = [...prev] as [string, string];
          newValues[idx] = value;
          onChange?.({ min: newValues[0], max: newValues[1], currency });
          return newValues;
        });
      },
      setCurrency(newCurrency: string) {
        setCurrencyState(newCurrency);
        onChange?.({
          min: salaryRange[0],
          max: salaryRange[1],
          currency: newCurrency,
        });
      },
      isValid() {
        return isRangeValid(salaryRange);
      },
      getErrorMessage() {
        if (!salaryRange[0].trim() || !salaryRange[1].trim()) {
          return 'Both minimum and maximum salary are required';
        }
        if (!isRangeValid(salaryRange)) {
          return 'Invalid salary range';
        }
        return '';
      },
    }),
    [salaryRange, currency, onChange],
  );

  const handleMinChange = (value: string) => {
    const newRange: [string, string] = [value, salaryRange[1]];
    setSalaryRange(newRange);
    onChange?.({ min: value, max: salaryRange[1], currency });
  };

  const handleMaxChange = (value: string) => {
    const newRange: [string, string] = [salaryRange[0], value];
    setSalaryRange(newRange);
    onChange?.({ min: salaryRange[0], max: value, currency });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrencyState(value);
    onChange?.({ min: salaryRange[0], max: salaryRange[1], currency: value });
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <H6 className="font-semibold">Salary</H6>
      <div className="flex items-center justify-center gap-1">
        <Input
          size={size}
          name={`${name}-min`}
          startContent={iconMin}
          type="text"
          placeholder={placeholderMin}
          value={salaryRange[0]}
          className="max-w-25"
          onFocus={() => setIsFocusedMin(true)}
          onBlur={() => setIsFocusedMin(false)}
          onChange={handleMinChange}
        />
        <span className="text-secondary-text font-semibold">-</span>
        <Input
          size={size}
          name={`${name}-max`}
          startContent={iconMax}
          type="text"
          placeholder={placeholderMax}
          value={salaryRange[1]}
          className="max-w-25"
          onFocus={() => setIsFocusedMax(true)}
          onBlur={() => setIsFocusedMax(false)}
          onChange={handleMaxChange}
        />
        <CurrencySelector onChange={handleCurrencyChange} />
      </div>
    </div>
  );
};
