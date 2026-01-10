import { H4 } from '@common/components/typography';
import { SettingsIcon } from '@common/icons/SettingsIcon';
import { cn, Tab, Tabs } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useQueryState } from 'nuqs';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { createSettingsStore } from './pages/profile/settingsProfileStore';

export const SettingsLayout = () => {
  const { data: user } = useAuth();
  const settingsStore = createSettingsStore({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    image: user?.image || '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useQueryState('settingsTab', {
    defaultValue: 'profile',
  });

  const settingsItems = [
    {
      key: 'profile',
      label: 'Profile',
      href: '.',
      className: 'text-primary data-[hover=true]:bg-primary/10',
      activeClassName: 'bg-primary/15 border-primary',
    },
    {
      key: 'account',
      label: 'Account',
      href: 'account',
      className: 'text-primary data-[hover=true]:bg-primary/10',
      activeClassName: 'bg-primary/15 border-primary',
    },
    {
      key: 'security',
      label: 'Security',
      href: 'security',
      className: 'text-primary data-[hover=true]:bg-primary/10',
      activeClassName: 'bg-primary/15 border-primary',
    },
  ];

  const handleSelectionChange = (key: string | number) => {
    const item = settingsItems.find((i) => i.key === key);
    if (item) {
      setTab(item.key);
      navigate(item.href);
    }
  };

  const activeTabKey =
    settingsItems.find((item) => {
      const pathEnd = location.pathname.split('/').pop();
      if (item.href === '.') {
        return pathEnd === 'settings';
      }
      return item.href === pathEnd;
    })?.key || 'profile';

  const activeTabItem = settingsItems.find((item) => item.key === tab);

  return (
    <div className="bg-background h-[calc(100dvh)] w-full flex-col">
      <nav className="py-2 px-4 flex flex-row items-center justify-between w-full border-b border-border bg-background">
        <div className="flex items-center justify-center gap-2">
          <SettingsIcon className="text-primary size-6" />
          <H4>Settings</H4>
        </div>
        <Tabs
          onSelectionChange={handleSelectionChange}
          selectedKey={activeTabKey}
          classNames={{
            base: 'w-full px-4 py-1',
            tabContent: 'text-primary',
            cursor: cn('rounded border-none', activeTabItem?.activeClassName),
            tab: cn(
              'rounded data-[hover-unselected=true]:bg-primary-100/80 py-4 shadow-none',
              'border-none transition-all duration-300 data-[hover-unselected=true]:opacity-100',
            ),
            panel: 'p-0',
          }}
          aria-label="settings-tabs"
          variant="light"
          radius="sm"
          size="sm"
        >
          {settingsItems.map((item) => (
            <Tab
              key={item.key}
              title={
                <div
                  className={cn(
                    'flex items-center space-x-1 font-medium',
                    item.className,
                  )}
                >
                  <span>{item.label}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </nav>
      <div className="flex-1 overflow-y-scroll">
        <Outlet context={settingsStore} />
      </div>
    </div>
  );
};
