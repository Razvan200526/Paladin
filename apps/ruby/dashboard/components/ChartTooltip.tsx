import { cn } from '@heroui/react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: any, name?: string) => string;
  className?: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  className,
}: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-light border border-primary-100 rounded-lg p-3',
        className,
      )}
    >
      {label && (
        <p className="text-sm font-medium text-primary mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-secondary-text capitalize">
              {entry.name}:
            </span>
            <span className="text-xs font-semibold text-primary">
              {valueFormatter
                ? valueFormatter(entry.value, entry.name)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
