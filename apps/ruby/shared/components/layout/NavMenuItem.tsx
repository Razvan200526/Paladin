import { Tooltip } from '@common/components/Tooltip';
import { cn } from '@heroui/react';
import { NavLink } from 'react-router';

export const NavMenuItem = ({
  isMinimize,
  item,
}: {
  isMinimize: boolean;
  item: {
    key: string;
    href: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
    title: string;
  };
}) => {
  return isMinimize ? (
    <Tooltip content={item.title} placement="right">
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            'px-2 py-2.5 w-full flex flex-row gap-2 items-center justify-start rounded',
            'hover:bg-hover',
            isActive
              ? 'bg-secondary/20 hover:bg-secondary/20 border-l-5 rounded-l-none border-secondary'
              : '',
            isMinimize ? 'justify-center' : '',
          )
        }
      >
        {({ isActive }) => (
          <item.icon
            className={cn(
              'size-5',
              isActive ? 'text-secondary-text' : 'text-primary',
            )}
          />
        )}
      </NavLink>
    </Tooltip>
  ) : (
    <NavLink
      key={item.key}
      to={item.href}
      className={({ isActive }) =>
        cn(
          'px-2 py-2.5 w-full flex flex-row gap-2 items-center justify-start rounded',
          'hover:bg-hover',
          isActive
            ? 'bg-secondary/20 hover:bg-secondary/20 border-l-5 rounded-l-none border-secondary'
            : '',
          isMinimize ? 'justify-center' : '',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={cn(
              'size-5',
              isActive ? 'text-secondary-text' : 'text-primary',
            )}
          />
          <span
            className={cn(
              isActive ? 'text-secondary-text' : 'text-primary',
              'font-primary',
            )}
          >
            {item.title}
          </span>
        </>
      )}
    </NavLink>
  );
};
