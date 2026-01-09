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
import { ScrollShadow, Spinner, Tab, Tabs } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useJobMatchStats, useRefreshJobMatches } from '../hooks';
import { type JobTabKey, useJobsStore } from '../store';
import { ImportJobsButton } from './header/ImportJobsButton';
import { JobsFilter } from './JobsFilter';

export const JobPageHeader = () => {
  const { data: user } = useAuth();
  const { filters, setFilter, setPreferencesOpen } = useJobsStore();
  const selectedTab = filters.tab;
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
    <div className="p-2 sm:p-4 border-b border-border bg-background">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
        {/* Title Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg">
            <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <H3 className="text-primary text-base sm:text-lg">Job Matches</H3>
            <p className="font-semibold text-secondary-text text-xs sm:text-sm hidden sm:block">
              AI-powered job recommendations based on your resume
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <ImportJobsButton userId={user?.id} onSuccess={handleRefresh} />
          <Button
            size="sm"
            variant="flat"
            startContent={<SettingsIcon className="size-3.5" />}
            onPress={() => setPreferencesOpen(true)}
            className="hidden sm:flex"
          >
            Preferences
          </Button>
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onPress={() => setPreferencesOpen(true)}
            className="sm:hidden"
          >
            <SettingsIcon className="size-3.5" />
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
            className="hidden sm:flex"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Matches'}
          </Button>
          <Button
            size="sm"
            color="primary"
            isIconOnly
            isDisabled={isRefreshing || !user?.id}
            onPress={handleRefresh}
            className="sm:hidden"
          >
            {isRefreshing ? (
              <Spinner size="sm" color="current" />
            ) : (
              <ArrowPathIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats Tabs - Horizontally scrollable on mobile */}
      <div className="mb-3 sm:mb-4 -mx-2 sm:mx-0">
        {isLoadingStats ? (
          <div className="flex items-center gap-2 px-2">
            <Spinner size="sm" />
            <span className="text-sm text-muted">Loading stats...</span>
          </div>
        ) : stats ? (
          <ScrollShadow orientation="horizontal" className="px-2 sm:px-0">
            <Tabs
              aria-label="Job match stats"
              variant="underlined"
              color="primary"
              selectedKey={selectedTab}
              onSelectionChange={(key) => {
                setFilter('tab', key as JobTabKey);
              }}
              classNames={{
                tabList: 'gap-2 sm:gap-4 min-w-max',
                tab: 'px-0 h-8 sm:h-10',
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
                  shortLabel: 'High',
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
                    <div className="flex items-center gap-1 sm:gap-2">
                      <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-text" />
                      <span className="text-primary text-xs sm:text-sm">
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden">
                          {item.shortLabel || item.label}
                        </span>
                      </span>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full ${item.badgeClass}`}
                      >
                        {item.count}
                      </span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </ScrollShadow>
        ) : null}
      </div>

      <JobsFilter />
    </div>
  );
};
