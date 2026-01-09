import { formatDate } from '@common/utils';
import {
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { JobListing } from '@sdk/JobFetcher';

interface JobMetaInfoProps {
  job: JobListing;
}

const formatSalary = (min?: number, max?: number, currency = 'USD') => {
  if (!min && !max) return null;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  return min
    ? `${formatter.format(min)}+`
    : `Up to ${formatter.format(max ?? 0)}`;
};

export const JobMetaInfo = ({ job }: JobMetaInfoProps) => {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted">
      <span className="flex items-center gap-1">
        <MapPinIcon className="w-3.5 h-3.5 text-primary" />
        {job.isRemote ? 'Remote' : job.location}
      </span>
      <span className="flex items-center gap-1">
        <BriefcaseIcon className="w-3.5 h-3.5 text-primary" />
        {job.jobType}
      </span>
      {salary && (
        <span className="flex items-center gap-1">
          <CurrencyDollarIcon className="w-3.5 h-3.5 text-primary" />
          {salary}
        </span>
      )}
      {job.postedAt && (
        <span className="flex items-center gap-1">
          <ClockIcon className="w-3.5 h-3.5 text-primary" />
          {formatDate(job.postedAt)}
        </span>
      )}
    </div>
  );
};
