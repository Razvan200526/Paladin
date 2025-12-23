import { H4 } from '@common/components/typography';
import { ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import { PageLoader } from '@ruby/shared/components/PageLoader';
import { useOutletContext } from 'react-router';
import { ApplicationList } from '../components/ApplicationList';
import { FilteredApplicationsHeader } from '../components/FilterApplicationsHeader';
import { NoFilteredApplications } from '../components/NoFilteredApplications';
import type { ApplicationsResourceOutletContext } from '../layout/ApplicationsLayout';

export const ApplicationPage = () => {
  const { filteredApplications, totalApplications, applicationsLoading } =
    useOutletContext<ApplicationsResourceOutletContext>();

  if (applicationsLoading) {
    return <PageLoader />;
  }
  return (
    <ScrollShadow className="h-full overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {totalApplications > 0 ? (
          <>
            <FilteredApplicationsHeader
              filteredApplications={filteredApplications}
              totalApplications={totalApplications}
            />

            {filteredApplications.length > 0 ? (
              <ApplicationList applications={filteredApplications} />
            ) : (
              <NoFilteredApplications />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="p-4 rounded-full bg-primary/5 mb-4">
              <Icon icon="heroicons:briefcase" className="size-12 text-muted" />
            </div>
            <H4 className="text-secondary-text mb-2">No applications yet</H4>
            <p className="text-muted text-sm max-w-md">
              Start tracking your job applications to see them here.
            </p>
          </div>
        )}
      </div>
    </ScrollShadow>
  );
};
