import { ResumeCardSkeleton } from '@ruby/resources/resumes/skeletons/ResumeCardSkeleton';
import NoFilteredResources from '@ruby/resources/shared/components/NoFilteredResources';
import type { CoverLetterType } from '@sdk/types';
import { Link } from 'react-router';
import { CoverLetterCard } from '../cards/CoverLetterCard';

export const CoverletterList = ({
  coverletterLoading,
  filteredCoverletters,
}: {
  coverletterLoading: boolean;
  filteredCoverletters: CoverLetterType[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredCoverletters.length > 0 ? (
        filteredCoverletters.map((coverletter: CoverLetterType) =>
          coverletterLoading ? (
            <ResumeCardSkeleton key={'somekey'} />
          ) : (
            <Link
              to={`/home/resources/coverletters/${coverletter.id}`}
              key={coverletter.id}
            >
              <CoverLetterCard coverLetter={coverletter} />
            </Link>
          ),
        )
      ) : (
        <NoFilteredResources resourceType="resumes" />
      )}
    </div>
  );
};
