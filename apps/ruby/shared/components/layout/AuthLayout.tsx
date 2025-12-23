import { Toast } from '@common/components/toast';
import { cn } from '@heroui/react';
import { useAppSidebarStore } from '@ruby/appStore';
import { useAuth } from '@ruby/shared/hooks';
import { Outlet } from 'react-router';
import { PageLoader } from '../PageLoader';
import { Sidebar } from './sidebar/Sidebar';
import { SidebarDrawer } from './sidebar/SidebarDrawer';

export const AuthLayout = () => {
  const { isLoading: isAuthLoading, error } = useAuth();
  const { isOpen } = useAppSidebarStore();

  if (error) {
    Toast.error({
      title: 'Could not sign in',
      description: 'Please try again later.',
    });
  }
  if (isAuthLoading) {
    return <PageLoader />;
  }
  return (
    <div className="min-h-dvh flex flex-row font-medium">
      <SidebarDrawer />
      <div
        className={cn(
          'border-r border-border relative w-52 flex-col gap-8 p-2',
          !isOpen ? 'hidden' : 'hidden 2xl:flex',
        )}
      >
        <Sidebar />
      </div>
      <div className="min-h-dvh w-full font-normal bg-background">
        <Outlet />
      </div>
    </div>
  );
};
