import { Button } from '@common/components/button';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@heroui/react';
import { useState } from 'react';

type CollapsibleSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const CollapsibleSection = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50">
      <Button
        type="button"
        onPress={() => setIsOpen(!isOpen)}
        variant="light"
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span className="text-xs font-semibold tracking-wide uppercase">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="size-4 text-primary-400" />
        ) : (
          <ChevronDownIcon className="size-4 text-primary-400" />
        )}
      </Button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>
      </div>
    </div>
  );
};
