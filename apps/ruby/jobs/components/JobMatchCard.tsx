import { Card } from '@common/components/card';
import { H5 } from '@common/components/typography';
import { cn } from '@heroui/react';
import type { JobMatch, MatchStatus } from '../../../sdk/JobFetcher';
import { useUpdateMatchStatus } from '../hooks';
import { CompatibilityScore } from './CompatibilityScore';
import { JobCardActions } from './JobCardActions';
import { JobCompanyLogo } from './JobCompanyLogo';
import { JobMetaInfo } from './JobMetaInfo';
import { JobSkillsPreview } from './JobSkillsPreview';
import { JobStatusBadge } from './JobStatusBadge';

interface JobMatchCardProps {
  match: JobMatch;
  isSelected?: boolean;
  onClick?: () => void;
}

export const JobMatchCard = ({
  match,
  isSelected,
  onClick,
}: JobMatchCardProps) => {
  const { mutate: updateStatus, isPending } = useUpdateMatchStatus();
  const { job } = match;

  const handleStatusChange = (status: MatchStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus({ matchId: match.id, status });
  };

  return (
    <Card
      className={cn(
        'p-4 rounded-lg border border-border bg-light cursor-pointer transition-all duration-200',
        'hover:border-primary/30 shadow-none',
        isSelected && 'border-border-hover shadow-md',
        match.status === 'dismissed' && 'opacity-50',
      )}
    >
      <div onClick={onClick}>
        <div className="flex gap-4">
          <div className="shrink-0">
            <JobCompanyLogo logo={job.companyLogo} company={job.company} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="truncate">
                <H5 className="font-semibold text-primary truncate">
                  {job.title}
                </H5>
                <p className="text-sm text-secondary-text">{job.company}</p>
              </div>
              <CompatibilityScore
                score={match.compatibilityScore}
                size="sm"
                showLabel={false}
              />
            </div>

            <JobMetaInfo job={job} />
            <JobSkillsPreview skills={match.matchedSkills} />
            <JobStatusBadge status={match.status} />
          </div>
        </div>

        <JobCardActions
          status={match.status}
          jobUrl={job.url}
          isPending={isPending}
          onStatusChange={handleStatusChange}
        />
      </div>
    </Card>
  );
};
