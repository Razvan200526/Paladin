import { Button } from '@common/components/button';
import { H3 } from '@common/components/typography';
import { SettingsIcon } from '@common/icons/SettingsIcon';
import {
  ArrowPathIcon,
  BookmarkIcon,
  BriefcaseIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Spinner, Tab, Tabs } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useJobMatchStats, useRefreshJobMatches } from '../hooks';
import { useJobsStore } from '../store';
import { ImportJobsButton } from './header/ImportJobsButton';
import { JobsFilter } from './JobsFilter';

export const JobPageHeader = () => {
  const { data: user } = useAuth();
  const { setPreferencesOpen } = useJobsStore();
  const { data: stats, isLoading: isLoadingStats } = useJobMatchStats(
    user?.id || '',
  );
  const { mutate: refreshMatches, isPending: isRefreshing } =
    useRefreshJobMatches();

  const handleRefresh = () => {
    if (!user?.id) return;
    refreshMatches(user.id);
  };

  return (
    <div className="p-4 border-b border-border bg-background">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <BriefcaseIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <H3 className="text-primary">Job Matches</H3>
            <p className="font-semibold text-secondary-text">
              AI-powered job recommendations based on your resume
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ImportJobsButton userId={user?.id} onSuccess={handleRefresh} />
          <Button
            size="sm"
            variant="flat"
            startContent={<SettingsIcon className="size-3.5" />}
            onPress={() => setPreferencesOpen(true)}
          >
            Preferences
          </Button>
          <Button
            size="sm"
            color="primary"
            startContent={
              isRefreshing ? (
                <Spinner size="sm" color="current" />
              ) : (
                <ArrowPathIcon className="w-4 h-4" />
              )
            }
            isDisabled={isRefreshing || !user?.id}
            onPress={handleRefresh}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Matches'}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        {isLoadingStats ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted">Loading stats...</span>
          </div>
        ) : stats ? (
          <Tabs
            aria-label="Job match stats"
            variant="underlined"
            color="primary"
            classNames={{
              tabList: 'gap-4',
              tab: 'px-0 h-10',
            }}
          >
            {[
              {
                key: 'all',
                label: 'All',
                icon: BriefcaseIcon,
                count: stats.totalMatches,
                badgeClass: 'bg-primary/10 text-primary',
              },
              {
                key: 'new',
                label: 'New',
                icon: SparklesIcon,
                count: stats.newMatches,
                badgeClass: 'bg-primary/10 text-primary',
              },
              {
                key: 'high',
                label: 'High Match',
                icon: ChartBarIcon,
                count: stats.highMatchCount,
                badgeClass: 'bg-primary/10 text-primary',
              },
              {
                key: 'saved',
                label: 'Saved',
                icon: BookmarkIcon,
                count: stats.savedMatches,
                badgeClass: 'bg-primary/10 text-primary',
              },
              {
                key: 'applied',
                label: 'Applied',
                icon: PaperAirplaneIcon,
                count: stats.appliedMatches,
                badgeClass: 'bg-primary/10 text-primary',
              },
            ].map((item) => (
              <Tab
                key={item.key}
                title={
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-secondary-text" />
                    <span className="text-primary">{item.label}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${item.badgeClass}`}
                    >
                      {item.count}
                    </span>
                  </div>
                }
              />
            ))}
          </Tabs>
        ) : null}
      </div>

      <JobsFilter />
    </div>
  );
};
