import { H5 } from '@common/components/typography';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { FetchExternalJobs } from './FetchExternalJobs';

interface JobListEmptyStateProps {
  hasFilters: boolean;
  userId?: string;
  onSuccess: () => void;
}

export const JobListEmptyState = ({
  hasFilters,
  userId,
  onSuccess,
}: JobListEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <SparklesIcon className="w-8 h-8 text-primary" />
      </div>
      <H5 className="text-primary mb-2">No matches found</H5>
      <p className="text-sm text-secondary-text font-semibold mb-4">
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Import jobs from external sources to get started'}
      </p>
      <div className="w-full max-w-md">
        <FetchExternalJobs userId={userId} onSuccess={onSuccess} />
      </div>
    </div>
  );
};
