import type { ApplicationType } from '@client/sdk/types';

export const FilteredApplicationsHeader = ({
  filteredApplications,
  totalApplications,
}: {
  filteredApplications?: ApplicationType[];
  totalApplications: number;
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-primary font-semibold">
        Showing{' '}
        <span className="font-bold text-secondary">
          {filteredApplications?.length || 0}
        </span>{' '}
        of <span className="font-bold text-secondary">{totalApplications}</span>{' '}
        {totalApplications === 1 ? 'application' : 'applications'}
      </p>
    </div>
  );
};
