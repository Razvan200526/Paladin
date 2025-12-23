import { Card, cn } from '@heroui/react';
import type { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export const SettingsCard = ({
  title,
  description,
  children,
  className,
  footer,
}: SettingsCardProps) => {
  return (
    <Card
      className={cn(
        'p-6 bg-background border border-border shadow-none rounded-lg',
        className,
      )}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="pt-4 border-t border-border">{footer}</div>}
      </div>
    </Card>
  );
};
