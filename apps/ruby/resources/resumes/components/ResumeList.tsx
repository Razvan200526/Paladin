import NoFilteredResources from '@ruby/resources/shared/components/NoFilteredResources';
import type { ResumeType } from '@sdk/types';
import { Link } from 'react-router';
import { ResumeCard } from '../cards/ResumeCard';
import { ResumeCardSkeleton } from '../skeletons/ResumeCardSkeleton';

export const ResumeList = ({
  resumesLoading,
  filteredResumes,
}: {
  resumesLoading: boolean;
  filteredResumes: ResumeType[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredResumes.length > 0 ? (
        filteredResumes.map((resume: ResumeType) =>
          resumesLoading ? (
            <ResumeCardSkeleton key={'somekey'} />
          ) : (
            <Link to={`/home/resources/resumes/${resume.id}`} key={resume.id}>
              <ResumeCard resume={resume} />
            </Link>
          ),
        )
      ) : (
        <NoFilteredResources resourceType="resumes" />
      )}
    </div>
  );
};
