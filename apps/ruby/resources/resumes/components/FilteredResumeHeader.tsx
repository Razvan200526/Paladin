import type { ResumeType } from '@client/sdk/types';

export const FilteredResumeHeader = ({
  filteredResumes,
  totalResumes,
}: {
  filteredResumes?: ResumeType[];
  totalResumes: number;
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-primary font-semibold">
        Showing{' '}
        <span className="font-bold text-secondary">
          {filteredResumes?.length || 0}
        </span>{' '}
        of <span className="font-bold text-secondary">{totalResumes}</span>{' '}
        {totalResumes === 1 ? 'resume' : 'resumes'}
      </p>
    </div>
  );
};
