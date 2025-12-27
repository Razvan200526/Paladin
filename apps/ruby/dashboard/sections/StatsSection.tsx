import { useAuth } from '@ruby/shared/hooks';
import { StatsCard } from '../components/StatsCard';
import { useAnalyticsOverview } from '../hooks/useAnalytics';
import { StatsSectionSkeleton } from './StatsSectionSkeleton';

export const StatsSection = () => {
  const { data: user } = useAuth();
  const {
    data: overview,
    isFetching,
    isError,
  } = useAnalyticsOverview(user?.id);

  if (isFetching) {
    return <StatsSectionSkeleton />;
  }

  if (isError || !overview) {
    return <StatsSectionSkeleton />;
  }

  const quickStats = [
    {
      label: 'Total Applications',
      value: overview?.totalApplications || 0,
      change: `+${overview?.thisMonthCount || 0}`,
      trend: overview?.thisMonthCount
        ? overview.thisMonthCount >= 0
          ? ('up' as const)
          : ('down' as const)
        : undefined,
    },
    {
      label: 'Response Rate',
      value: `${overview?.responseRate.toFixed(2) || 0}%`,
      change: overview?.responseRate
        ? overview.responseRate > 30
          ? '+5%'
          : '-2%'
        : '0%',
      trend: overview?.responseRate
        ? overview.responseRate > 30
          ? ('up' as const)
          : ('down' as const)
        : undefined,
    },
    {
      label: 'Interviewing',
      value: overview.statusCounts.interviewing || 'none',
      change: `+${overview.statusCounts.interviewing || 0}`,
      trend: overview.statusCounts.interviewing
        ? overview.statusCounts?.interviewing > 0
          ? ('up' as const)
          : ('down' as const)
        : undefined,
    },
    {
      label: 'This Week',
      value: overview?.thisWeekCount || 0,
      change: overview?.thisWeekCount
        ? overview.thisWeekCount > 5
          ? '+3'
          : `-${5 - overview.thisWeekCount}`
        : '0',
      trend: overview?.thisWeekCount
        ? overview.thisWeekCount > 5
          ? ('up' as const)
          : ('down' as const)
        : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};
