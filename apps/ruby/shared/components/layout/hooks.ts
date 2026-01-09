import { AiChatIcon } from '@common/icons/AiChatIcon';
import { ApplicationsIcon } from '@common/icons/ApplicationsIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { ResourceIcon } from '@common/icons/ResourceIcon';
import { SettingsIcon } from '@common/icons/SettingsIcon';
import { LayoutDashboard } from 'lucide-react';

export const useSideBarItems = () => {
  const mainItems = [
    {
      key: 'Dashboard',
      icon: LayoutDashboard,
      href: 'dashboard',
      title: 'Dashboard',
    },
    {
      key: 'jobs',
      href: 'jobs',
      icon: JobIcon,
      title: 'Job Matches',
    },
    {
      key: 'Resources',
      icon: ResourceIcon,
      href: 'resources',
      title: 'Resources',
    },
    {
      key: 'applications',
      href: 'applications',
      icon: ApplicationsIcon,
      title: 'Applications',
    },
    {
      key: 'ask',
      href: 'ask',
      icon: AiChatIcon,
      title: 'Ask AI',
    },
  ];

  const secondaryItems = [
    {
      key: 'settings',
      href: 'settings',
      icon: SettingsIcon,
      title: 'Settings',
    },
  ];

  return { secondaryItems, mainItems };
};
