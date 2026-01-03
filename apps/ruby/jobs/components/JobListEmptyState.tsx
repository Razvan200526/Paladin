import { H5 } from '@common/components/typography';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface JobListEmptyStateProps {
  hasFilters: boolean;
}

export const JobListEmptyState = ({ hasFilters }: JobListEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <SparklesIcon className="w-8 h-8 text-primary" />
      </div>
      <H5 className="text-primary mb-2">No matches found</H5>
      <p className="text-sm text-secondary-text font-semibold">
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Click "Import Jobs" in the header to get started'}
      </p>
    </div>
  );
};
