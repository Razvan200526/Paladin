import { ScrollShadow } from '@heroui/react';
import { useOutletContext } from 'react-router';
import type { ResourceOutletContext } from '../ResourceLayout';
import { FilteredResumeHeader } from './components/FilteredResumeHeader';
import { NoResumes } from './components/NoResumes';
import { ResumeList } from './components/ResumeList';

export const ResumePage = () => {
  const {
    resumesLoading,
    resumeBuildersLoading,
    filteredResumes,
    resumeBuilders,
    totalResumes,
  } = useOutletContext<ResourceOutletContext>();

  const totalCount = totalResumes + (resumeBuilders?.length || 0);

  if (totalCount === 0) {
    return <NoResumes />;
  }

  return (
    <div className="m-4 bg-background h-[calc(100dvh-7rem)] rounded">
      <ScrollShadow size={8} className="h-full overflow-y-scroll">
        <div className="p-4">
          {filteredResumes && (
            <FilteredResumeHeader
              filteredResumes={filteredResumes}
              totalResumes={totalCount}
            />
          )}
          <ResumeList
            resumesLoading={resumesLoading}
            resumeBuildersLoading={resumeBuildersLoading}
            filteredResumes={filteredResumes}
            resumeBuilders={resumeBuilders}
          />
        </div>
      </ScrollShadow>
    </div>
  );
};
