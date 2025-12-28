import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { Spinner } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { ProgressBar } from '../components/ProgressBar';
import { useAnalyticsOverview } from '../hooks/useAnalytics';

// Default monthly targets - could be made configurable
const MONTHLY_TARGET = 30;
const WEEKLY_TARGET = 8;

export const GoalsSection = () => {
  const { data: user } = useAuth();
  const {
    data: overview,
    isFetching,
    isError,
  } = useAnalyticsOverview(user?.id);

  const thisMonthCount = overview?.thisMonthCount ?? 0;
  const thisWeekCount = overview?.thisWeekCount ?? 0;
  const _responseRate = overview?.responseRate.toFixed(2) ?? '0';
  const interviewCount = overview?.statusCounts?.interviewing ?? 0;

  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-border duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <H6 className="text-base text-primary">Monthly Goals</H6>
          {overview && (
            <span className="text-xs text-secondary-text font-medium">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
        {isFetching ? (
          <div className="flex items-center justify-center h-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-20 text-secondary-text text-sm">
            Failed to load goals data
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <ProgressBar
              label="Monthly Applications"
              current={thisMonthCount}
              target={MONTHLY_TARGET}
              color="bg-primary-400"
            />
            <ProgressBar
              label="Weekly Applications"
              current={thisWeekCount}
              target={WEEKLY_TARGET}
              color="bg-secondary-400"
            />
            {/*<ProgressBar
              label="Response Rate"
              current={Number.parseFloat(responseRate)}
              color="bg-info-400"
              target={Number.parseFloat(responseRate)}
              suffix="%"
            /> TODO : Get rid of the target beacause the target should't be 100*/}
            <ProgressBar
              label="Active Interviews"
              current={interviewCount}
              target={5}
              color="bg-success-400"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
