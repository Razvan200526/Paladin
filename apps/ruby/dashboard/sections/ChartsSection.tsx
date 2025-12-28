import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { cn, Spinner, Tab, Tabs } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendsPeriod } from '../../../sdk/AnalyticsFetcher';
import { ChartTooltip } from '../components/ChartTooltip';
import {
  useAnalyticsStatusBreakdown,
  useAnalyticsTrends,
} from '../hooks/useAnalytics';

const PERIOD_OPTIONS: { key: TrendsPeriod; label: string }[] = [
  { key: 'last_week', label: '7D' },
  { key: 'last_month', label: '1M' },
  { key: 'last_3_months', label: '3M' },
  { key: 'last_6_months', label: '6M' },
  { key: 'last_year', label: '1Y' },
];

export const ChartsSection = () => {
  const { data: user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] =
    useState<TrendsPeriod>('last_6_months');

  const {
    data: trendsData,
    isFetching: isTrendsFetching,
    isError: isTrendsError,
  } = useAnalyticsTrends(user?.id, selectedPeriod);

  const {
    data: statusData,
    isFetching: isStatusFetching,
    isError: isStatusError,
  } = useAnalyticsStatusBreakdown(user?.id);

  const handlePeriodChange = (key: React.Key) => {
    setSelectedPeriod(key as TrendsPeriod);
  };

  const applicationTrendData =
    trendsData?.trends?.map((trend: any) => ({
      label: trend.label,
      applications: trend.applications,
      responses: trend.responses,
      interviews: trend.interviews,
    })) || [];

  const statusBreakdownData =
    statusData?.breakdown?.map((item) => ({
      name: item.name,
      value: item.value,
      color: item.color,
    })) || [];

  const displayTrendData =
    applicationTrendData.length > 0
      ? applicationTrendData
      : [{ label: '', applications: 0, responses: 0, interviews: 0 }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="bg-light border border-border hover:border-border-hover duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <H6 className="text-base text-primary shrink-0">Trends</H6>
            <Tabs
              size="sm"
              variant="light"
              color="primary"
              selectedKey={selectedPeriod}
              onSelectionChange={handlePeriodChange}
              classNames={{
                tabList: 'gap-0 p-0.5 bg-primary-50 rounded-lg',
                tab: cn(
                  'px-2.5 py-1 h-auto min-w-0',
                  'data-[hover=true]:bg-transparent',
                ),
                tabContent: 'text-xs font-medium text-secondary-text',
                cursor: 'bg-light rounded-md',
              }}
            >
              {PERIOD_OPTIONS.map((option) => (
                <Tab key={option.key} title={option.label} />
              ))}
            </Tabs>
          </div>
          <div className="h-48 md:h-64">
            {isTrendsFetching ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" color="primary" />
              </div>
            ) : isTrendsError ? (
              <div className="flex items-center justify-center h-full text-secondary-text text-sm">
                Failed to load trends data
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
                initialDimension={{ width: 320, height: 200 }}
              >
                <AreaChart data={displayTrendData}>
                  <defs>
                    <linearGradient
                      id="colorApplications"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary-400)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary-400)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorResponses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-secondary-400)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-secondary-400)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorInterviews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-success-400)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-success-400)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-primary-100)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
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
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="var(--color-primary-500)"
                    strokeWidth={2}
                    fill="url(#colorApplications)"
                    name="Applications"
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="var(--color-secondary-500)"
                    strokeWidth={2}
                    fill="url(#colorResponses)"
                    name="Responses"
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stroke="var(--color-success-500)"
                    strokeWidth={2}
                    fill="url(#colorInterviews)"
                    name="Interviews"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>

      {/* Status Breakdown */}
      <Card className="bg-light border border-border hover:border-border-hover transition-border duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <H6 className="text-base text-primary">Application Status</H6>
            {statusData && statusData.total > 0 && (
              <span className="text-xs text-secondary-text font-medium">
                {statusData.total} total
              </span>
            )}
          </div>
          <div className="h-48 md:h-64 min-w-0" style={{ minHeight: 0 }}>
            {isStatusFetching ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" color="primary" />
              </div>
            ) : isStatusError ? (
              <div className="flex items-center justify-center h-full text-secondary-text text-sm">
                Failed to load status data
              </div>
            ) : statusBreakdownData.length === 0 ||
              statusBreakdownData.every((d) => d.value === 0) ? (
              <div className="h-full" />
            ) : (
              <div className="flex items-center h-full">
                <ResponsiveContainer
                  className="min-w-0"
                  minWidth={0}
                  width="60%"
                  height="100%"
                  initialDimension={{ width: 160, height: 200 }}
                >
                  <PieChart>
                    <Pie
                      data={statusBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <ChartTooltip
                          valueFormatter={(value) =>
                            `${value} application${value !== 1 ? 's' : ''}`
                          }
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex-1 space-y-2 pl-2">
                  {statusBreakdownData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-secondary-text truncate">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold text-primary ml-auto">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
