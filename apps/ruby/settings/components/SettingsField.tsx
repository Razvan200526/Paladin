import { cn } from '@heroui/react';
import type { ReactNode } from 'react';

interface SettingsFieldProps {
  label?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

export const SettingsField = ({
  label,
  description,
  children,
  className,
  required = false,
  error,
}: SettingsFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <div className="text-sm font-medium text-primary">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};
