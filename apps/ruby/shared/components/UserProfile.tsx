import { Button } from '@common/components/button';
import { ProfileIcon } from '@common/icons/ProfileIcon';
import { SignoutIcon } from '@common/icons/SignoutIcon';
import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { NavLink } from 'react-router';
import { backend } from '../backend';
import { useAuth } from '../hooks';

export const UserProfile = () => {
  const { data: user } = useAuth();
  const items = [
    {
      key: 'profile',
      href: '/profile',
      icon: ProfileIcon,
      title: 'Profile',
      size: 'size-4.5',
    },

    {
      key: 'signout',
      href: '/',
      icon: SignoutIcon,
      title: 'Logout',
      className: 'text-danger',
      size: 'size-4',
    },
  ];

  return (
    <Dropdown
      placement="top"
      radius="sm"
      offset={8}
      classNames={{
        content: 'border border-primary shadow-none rounded p-2',
      }}
    >
      <DropdownTrigger>
        <Button
          disableRipple
          className="h-24 items-center justify-between data-[hover=true]:bg-hover"
          variant="light"
        >
          <User
            avatarProps={{
              color: 'primary',
              size: 'sm',
              isBordered: false,
              src: user?.image,
            }}
            className="justify-start transition-transform"
            description={user?.email}
            name={user?.name}
          />
          <Icon className="size-4" icon="mi:select" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        className="p-0 gap-0"
        itemClasses={{
          base: [
            'rounded p-0',
            'text-primary bg-transparent',
            'data-[hover=true]:bg-hover',
            'data-[pressed=true]:bg-primary-50',
            'data-[focus-visible=true]:ring-primary',
          ],
        }}
      >
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            textValue={item.title}
            className={cn('font-medium w-full p-0', item.className)}
            onClick={async () => {
              item.key === 'signout' && (await backend.auth.signout());
            }}
          >
            <NavLink
              to={item.href}
              className={cn(
                'flex flex-row gap-2 items-center justify-start p-2',
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'size-5',
                      item.className,
                      isActive ? 'text-secondary-text' : '',
                    )}
                  />
                  <span
                    className={cn(
                      'text-primary size-5 truncate w-full',
                      item.className,
                      'font-medium',
                      isActive ? 'text-secondary-text' : '',
                    )}
                  >
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
