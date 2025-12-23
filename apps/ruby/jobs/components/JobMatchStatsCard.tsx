import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import {
  AcademicCapIcon,
  BookmarkIcon,
  BriefcaseIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@heroui/react';
import type { JobMatchStats } from '../../../sdk/JobFetcher';

interface JobMatchStatsCardProps {
  stats: JobMatchStats;
  className?: string;
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  color: string;
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
    <div className={cn('p-2 rounded-lg', color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-lg font-bold text-primary">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  </div>
);

export const JobMatchStatsCard = ({
  stats,
  className,
}: JobMatchStatsCardProps) => {
  const statItems = [
    {
      icon: BriefcaseIcon,
      label: 'Total Matches',
      value: stats.totalMatches,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: SparklesIcon,
      label: 'New Matches',
      value: stats.newMatches,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: ChartBarIcon,
      label: 'High Match (70%+)',
      value: stats.highMatchCount,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: BookmarkIcon,
      label: 'Saved',
      value: stats.savedMatches,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: PaperAirplaneIcon,
      label: 'Applied',
      value: stats.appliedMatches,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: ChartBarIcon,
      label: 'Avg Score',
      value: `${Math.round(stats.averageScore)}%`,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <Card className={cn('p-4 bg-light border border-border', className)}>
      <H6 className="mb-4 text-primary">Your Job Match Stats</H6>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statItems.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>

      {/* Top Skill Gaps */}
      {stats.topSkillGaps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <AcademicCapIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Skills to Learn
            </span>
          </div>
          <p className="text-xs text-muted mb-2">
            Adding these skills could improve your match rates:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.topSkillGaps.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
