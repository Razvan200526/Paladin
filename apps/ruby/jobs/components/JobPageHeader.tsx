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
          <div className="p-2 rounded-lg bg-primary/10">
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
            <Tab
              key="all"
              title={
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>All</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                    {stats.totalMatches}
                  </span>
                </div>
              }
            />
            <Tab
              key="new"
              title={
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  <span>New</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">
                    {stats.newMatches}
                  </span>
                </div>
              }
            />
            <Tab
              key="high"
              title={
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>High Match</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600">
                    {stats.highMatchCount}
                  </span>
                </div>
              }
            />
            <Tab
              key="saved"
              title={
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="w-4 h-4" />
                  <span>Saved</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    {stats.savedMatches}
                  </span>
                </div>
              }
            />
            <Tab
              key="applied"
              title={
                <div className="flex items-center gap-2">
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Applied</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-600">
                    {stats.appliedMatches}
                  </span>
                </div>
              }
            />
          </Tabs>
        ) : null}
      </div>

      <JobsFilter />
    </div>
  );
};
