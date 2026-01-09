import { CURRENCIES } from '@common/constants/currencies';
import { AutocompleteItem } from '@heroui/react';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectPropsType,
} from './AutocompleteSelect';
import styles from './Selector.module.css';
import 'flag-icons/css/flag-icons.min.css';

export const CurrencySelector = (
  props: Omit<AutocompleteSelectPropsType, 'items' | 'children'>,
) => {
  const [startContent, setStartContent] = useState(
    <DollarSign className="size-4 text-primary" />,
  );

  const currencies = CURRENCIES.map((currency) => ({
    key: currency.value,
    label: `${currency.value} - ${currency.label}`,
    value: currency.value,
    symbol: currency.symbol,
    countryCode: currency.countryCode,
  }));

  return (
    <AutocompleteSelect
      className={styles.trigger}
      classNames={{
        base: 'text-sm',
      }}
      {...props}
      isLoading={false}
      defaultItems={currencies}
      startContent={startContent}
      onChange={(value) => {
        const currency = CURRENCIES.find((c) => c.value === value);

        if (currency) {
          setStartContent(
            <span
              className={`fi fi-${currency.countryCode} rounded-sm text-base`}
            />,
          );
        } else {
          setStartContent(<DollarSign className="size-3.5 text-primary" />);
        }

        props.onChange?.(value);
      }}
    >
      {(currency: any) => (
        <AutocompleteItem key={currency.key} textValue={currency.label}>
          <span className="flex flex-row items-center gap-2">
            <span className={`fi fi-${currency.countryCode} rounded-sm`} />
            <span className="truncate font-medium text-sm">
              {currency.value}
            </span>
            <span className="text-xs text-default-400">{currency.symbol}</span>
          </span>
        </AutocompleteItem>
      )}
    </AutocompleteSelect>
  );
};
