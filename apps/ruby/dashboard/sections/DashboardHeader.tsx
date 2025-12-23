import { H4 } from '@common/components/typography';
import { useAuth } from '@ruby/shared/hooks';

export const DashboardHeader = () => {
  const { data: user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.firstName || user?.name?.split(' ')[0] || '';

  return (
    <nav className="px-6 py-4 flex flex-row items-center justify-between w-full border-b border-border bg-background">
      <div className="space-y-0.5">
        <H4 className="text-primary">Dashboard</H4>
        {firstName && (
          <p className="text-sm text-secondary-text">
            {getGreeting()}, {firstName}
          </p>
        )}
      </div>
      <span className="text-xs text-secondary-text font-medium hidden sm:block">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    </nav>
  );
};
