export type Currency = {
  value: string;
  label: string;
  countryCode: string;
  symbol: string;
};

export const CURRENCIES: Currency[] = [
  { value: 'USD', label: 'US Dollar', countryCode: 'us', symbol: '$' },
  { value: 'EUR', label: 'Euro', countryCode: 'eu', symbol: '€' },
  { value: 'GBP', label: 'British Pound', countryCode: 'gb', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen', countryCode: 'jp', symbol: '¥' },
  { value: 'AUD', label: 'Australian Dollar', countryCode: 'au', symbol: '$' },
  { value: 'CAD', label: 'Canadian Dollar', countryCode: 'ca', symbol: '$' },
  { value: 'CHF', label: 'Swiss Franc', countryCode: 'ch', symbol: 'Fr' },
  { value: 'CNY', label: 'Chinese Yuan', countryCode: 'cn', symbol: '¥' },
  { value: 'SEK', label: 'Swedish Krona', countryCode: 'se', symbol: 'kr' },
  { value: 'NZD', label: 'New Zealand Dollar', countryCode: 'nz', symbol: '$' },
  { value: 'MXN', label: 'Mexican Peso', countryCode: 'mx', symbol: '$' },
  { value: 'SGD', label: 'Singapore Dollar', countryCode: 'sg', symbol: '$' },
  { value: 'HKD', label: 'Hong Kong Dollar', countryCode: 'hk', symbol: '$' },
  { value: 'NOK', label: 'Norwegian Krone', countryCode: 'no', symbol: 'kr' },
  { value: 'KRW', label: 'South Korean Won', countryCode: 'kr', symbol: '₩' },
  { value: 'TRY', label: 'Turkish Lira', countryCode: 'tr', symbol: '₺' },
  { value: 'RUB', label: 'Russian Ruble', countryCode: 'ru', symbol: '₽' },
  { value: 'INR', label: 'Indian Rupee', countryCode: 'in', symbol: '₹' },
  { value: 'BRL', label: 'Brazilian Real', countryCode: 'br', symbol: 'R$' },
  { value: 'ZAR', label: 'South African Rand', countryCode: 'za', symbol: 'R' },
  { value: 'DKK', label: 'Danish Krone', countryCode: 'dk', symbol: 'kr' },
  { value: 'PLN', label: 'Polish Złoty', countryCode: 'pl', symbol: 'zł' },
  { value: 'THB', label: 'Thai Baht', countryCode: 'th', symbol: '฿' },
  { value: 'IDR', label: 'Indonesian Rupiah', countryCode: 'id', symbol: 'Rp' },
  { value: 'HUF', label: 'Hungarian Forint', countryCode: 'hu', symbol: 'Ft' },
  { value: 'CZK', label: 'Czech Koruna', countryCode: 'cz', symbol: 'Kč' },
  { value: 'ILS', label: 'Israeli Shekel', countryCode: 'il', symbol: '₪' },
  { value: 'CLP', label: 'Chilean Peso', countryCode: 'cl', symbol: '$' },
  { value: 'PHP', label: 'Philippine Peso', countryCode: 'ph', symbol: '₱' },
  { value: 'AED', label: 'UAE Dirham', countryCode: 'ae', symbol: 'د.إ' },
  { value: 'COP', label: 'Colombian Peso', countryCode: 'co', symbol: '$' },
  { value: 'SAR', label: 'Saudi Riyal', countryCode: 'sa', symbol: '﷼' },
  { value: 'MYR', label: 'Malaysian Ringgit', countryCode: 'my', symbol: 'RM' },
  { value: 'RON', label: 'Romanian Leu', countryCode: 'ro', symbol: 'lei' },
  { value: 'ARS', label: 'Argentine Peso', countryCode: 'ar', symbol: '$' },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find((currency) => currency.value === code);
};

export const getCurrencySymbol = (code: string): string => {
  const currency = getCurrencyByCode(code);
  return currency?.symbol || code;
};
