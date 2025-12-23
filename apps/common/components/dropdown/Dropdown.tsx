import {
  cn,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown as HeroDropdown,
} from '@heroui/react';
import type { Key, ReactNode } from 'react';

export type DropdownItemDataType = {
  key: string;
  label: ReactNode;
  className?: string;
  shortcut?: string; // ⌘N ⌘⇧E
  icon?: ReactNode;
  endContent?: ReactNode;
  subMenu?: ReactNode;
  onAction?: () => void;
};

export const Dropdown = ({
  trigger,
  items,
  onAction,
  className,
}: {
  trigger: ReactNode;
  items: DropdownItemDataType[];
  onAction?: (key: Key) => void;
  className?: string;
}) => {
  return (
    <HeroDropdown
      shouldBlockScroll={false}
      classNames={{
        base: 'border-none',
        content: cn('shadow-xl rounded border border-border', className),
      }}
    >
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <DropdownMenu
        aria-label="actions"
        onAction={onAction}
        variant="flat"
        color="primary"
        className="p-1"
      >
        {items.map((item) => {
          if (item.subMenu) {
            return (
              <DropdownItem
                onAction={item.onAction}
                key={item.key}
                className={cn('p-0', item.className)}
                closeOnSelect={false}
                textValue={
                  typeof item.label === 'string' ? item.label : item.key
                }
              >
                <HeroDropdown
                  placement="right-start"
                  classNames={{
                    content: cn('rounded border border-border', className),
                  }}
                >
                  <DropdownTrigger>
                    <div
                      className={cn(
                        'w-full flex justify-between items-center rounded px-2 py-1.5 text-sm cursor-default',
                        'text-primary',
                        'hover:bg-primary-100 cursor-pointer',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                      {item.endContent}
                    </div>
                  </DropdownTrigger>
                  {item.subMenu}
                </HeroDropdown>
              </DropdownItem>
            );
          }
          return (
            <DropdownItem
              key={item.key}
              className={cn(
                'rounded',
                'text-primary',
                'data-[hover=true]:bg-hover',
                item.className,
              )}
              startContent={item.icon}
              textValue={typeof item.label === 'string' ? item.label : item.key}
            >
              <div className="w-full flex justify-between items-center">
                {item.label}
                {item.endContent}
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </HeroDropdown>
  );
};
