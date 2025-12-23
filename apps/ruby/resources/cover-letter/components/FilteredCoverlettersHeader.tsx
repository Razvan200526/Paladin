import type { CoverLetterType } from '@client/sdk/types';

export const FilteredCoverlettersHeader = ({
  filteredCoverletters,
  totalCoverletters,
}: {
  filteredCoverletters?: CoverLetterType[];
  totalCoverletters: number;
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-primary font-semibold">
        Showing{' '}
        <span className="font-bold text-secondary">
          {filteredCoverletters?.length || totalCoverletters}
        </span>{' '}
        of <span className="font-bold text-secondary">{totalCoverletters}</span>{' '}
        {totalCoverletters === 1 ? 'cover letter' : 'cover letters'}
      </p>
    </div>
  );
};
