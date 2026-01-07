import type { ResumeBuilderType, ResumeType } from '@sdk/types';
import NoFilteredResources from '@ruby/resources/shared/components/NoFilteredResources';
import { Link } from 'react-router';
import { ResumeCard } from '../cards/ResumeCard';
import { ResumeBuilderCard } from '../cards/ResumeBuilderCard';
import { ResumeCardSkeleton } from '../skeletons/ResumeCardSkeleton';

export const ResumeList = ({
  resumesLoading,
  resumeBuildersLoading,
  filteredResumes,
  resumeBuilders = [],
}: {
  resumesLoading: boolean;
  resumeBuildersLoading?: boolean;
  filteredResumes: ResumeType[];
  resumeBuilders?: ResumeBuilderType[];
}) => {
  const isLoading = resumesLoading || resumeBuildersLoading;
  const hasResumes = filteredResumes.length > 0 || resumeBuilders.length > 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ResumeCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!hasResumes) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <NoFilteredResources resourceType="resumes" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Resume Builder items */}
      {resumeBuilders.map((resume: ResumeBuilderType) => (
        <Link
          to={`/home/resources/resumes/builder/${resume.id}`}
          key={`builder-${resume.id}`}
        >
          <ResumeBuilderCard resume={resume} />
        </Link>
      ))}

      {/* Uploaded PDF resumes */}
      {filteredResumes.map((resume: ResumeType) => (
        <Link to={`/home/resources/resumes/${resume.id}`} key={resume.id}>
          <ResumeCard resume={resume} />
        </Link>
      ))}
    </div>
  );
};
