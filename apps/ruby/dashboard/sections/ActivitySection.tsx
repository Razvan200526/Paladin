import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { ScrollShadow, Spinner } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ActivityItem } from '../components/ActivityItem';
import { ChartTooltip } from '../components/ChartTooltip';
import { useRecentActivity, useWeeklyActivity } from '../hooks/useAnalytics';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getActivityType = (
  status: string,
): 'application' | 'interview' | 'response' | 'resource' => {
  switch (status) {
    case 'Interviewing':
      return 'interview';
    case 'Accepted':
    case 'Rejected':
      return 'response';
    default:
      return 'application';
  }
};

const getActivityAction = (
  employer: string,
  jobTitle: string,
  status: string,
): string => {
  switch (status) {
    case 'Applied':
      return `Applied to ${jobTitle} at ${employer}`;
    case 'Interviewing':
      return `Interview scheduled for ${jobTitle} at ${employer}`;
    case 'Accepted':
      return `Accepted offer for ${jobTitle} at ${employer}`;
    case 'Rejected':
      return `Received response from ${employer}`;
    default:
      return `Updated application for ${jobTitle} at ${employer}`;
  }
};

export const ActivitySection = () => {
  const { data: user } = useAuth();
  const {
    data: weeklyData,
    isFetching: isWeeklyFetching,
    isError: isWeeklyError,
  } = useWeeklyActivity(user?.id);
  const {
    data: recentActivities,
    isFetching: isActivityFetching,
    isError: isActivityError,
  } = useRecentActivity(user?.id, 8);

  const hasNoWeeklyData =
    !weeklyData ||
    weeklyData.length === 0 ||
    weeklyData.every((d) => d.count === 0);
  const hasNoActivities = !recentActivities || recentActivities.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Weekly Activity Chart */}
      <Card className="bg-light border border-border hover:border-border-hover duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <H6 className="text-base text-primary">This Week</H6>
            {weeklyData && !hasNoWeeklyData && (
              <span className="text-xs text-secondary-text font-medium">
                {weeklyData.reduce((sum, d) => sum + d.count, 0)} total
              </span>
            )}
          </div>
          <div className="h-40 md:h-48">
            {isWeeklyFetching ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" color="primary" />
              </div>
            ) : isWeeklyError ? (
              <div className="flex items-center justify-center h-full text-secondary-text text-sm">
                Failed to load weekly data
              </div>
            ) : hasNoWeeklyData ? (
              <div className="flex items-center justify-center h-full text-secondary-text text-sm text-center px-4">
                No applications this week yet
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
                initialDimension={{ width: 320, height: 200 }}
              >
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-primary-100)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-primary-300)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-primary-300)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        valueFormatter={(value) =>
                          `${value} application${value !== 1 ? 's' : ''}`
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="count"
                    name="Applications"
                    fill="var(--color-primary-400)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-light border border-border lg:col-span-2 hover:border-border-hover duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <H6 className="text-base text-primary">Recent Activity</H6>
            {recentActivities && recentActivities.length > 0 && (
              <span className="text-xs text-secondary-text font-medium">
                Latest updates
              </span>
            )}
          </div>
          <ScrollShadow
            size={8}
            className="space-y-2 max-h-40 md:max-h-48 overflow-y-auto"
          >
            {isActivityFetching ? (
              <div className="flex items-center justify-center h-32">
                <Spinner size="lg" color="primary" />
              </div>
            ) : isActivityError ? (
              <div className="flex items-center justify-center h-32 text-secondary-text text-sm">
                Failed to load recent activity
              </div>
            ) : hasNoActivities ? (
              <div className="flex items-center justify-center h-32 text-secondary-text text-sm text-center">
                No recent activity. Start tracking your applications!
              </div>
            ) : (
              recentActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  action={getActivityAction(
                    activity.employer,
                    activity.jobTitle,
                    activity.status,
                  )}
                  time={formatTimeAgo(activity.updatedAt || activity.createdAt)}
                  type={getActivityType(activity.status)}
                />
              ))
            )}
          </ScrollShadow>
        </div>
      </Card>
    </div>
  );
};
