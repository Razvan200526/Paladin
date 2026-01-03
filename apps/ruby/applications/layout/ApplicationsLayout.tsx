import { Button } from '@common/components/button';
import { NumberChip } from '@common/components/chips/NumberChip';
import { NumberChipSkeleton } from '@common/components/chips/NumberChipSkeleton';
import { H4 } from '@common/components/typography';
import { PlusIcon } from '@heroicons/react/24/outline';
import { applicationFilterConfig } from '@ruby/resources/shared/filterConfigs';
import { filterAndSortApplications } from '@ruby/resources/shared/filterUtils';
import { useAuth } from '@ruby/shared/hooks';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router';
import type { ApplicationType } from '../../../sdk/types';
import { useApplicationFilterStore } from '../applicationStore';
import { ApplicationFilterSidebar } from '../components/ApplicationFilterSidebar';
import { CreateApplicationModal } from '../components/CreateApplicationModal';
import { useApplications } from '../hooks/applicationHooks';

export type ApplicationsResourceOutletContext = {
  filteredApplications: ApplicationType[];
  applicationsLoading: boolean;
  totalApplications: number;
};

export const useApplicationsResourceContext = () => {
  useOutletContext<ApplicationsResourceOutletContext>();
};
export const ApplicationsLayout = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: user } = useAuth();
  const location = useLocation();
  const { data: applications, isFetching: applicationsLoading } =
    useApplications(user?.id || '');
  const handleCreateApplication = () => {
    setShowCreateForm(true);
  };
  const applicationFilters = useApplicationFilterStore(
    (state) => state.applicationFilters,
  );
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    return filterAndSortApplications(applications, applicationFilters);
  }, [applications, applicationFilters]);

  const pathParts = location.pathname.split('/applications/');
  const isInspectPage = pathParts.length > 1 && pathParts[1].length > 0 && pathParts[1] !== '';
  const showFilterSidebar = !isInspectPage;
  const sidebarFilteredCount = filteredApplications?.length || 0;

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      <nav className="p-4 flex flex-row items-center justify-between w-full border-b border-border bg-background">
        <div className="flex items-center justify-center gap-2">
          <H4>Applications</H4>
          {applicationsLoading ? (
            <NumberChipSkeleton />
          ) : (
            <NumberChip value={applications?.length || 0} />
          )}
        </div>
        <div className="px-1">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            startContent={<PlusIcon className="size-4" />}
            onPress={handleCreateApplication}
            isIconOnly
          />
        </div>
      </nav>
      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Outlet
            context={
              {
                filteredApplications,
                applicationsLoading,
                totalApplications: applications?.length || 0,
              } satisfies ApplicationsResourceOutletContext
            }
          />
        </div>
        {showFilterSidebar && (
          <div className="py-2 pr-2">
            <ApplicationFilterSidebar
              config={applicationFilterConfig}
              filteredCount={sidebarFilteredCount}
              isLoading={applicationsLoading}
              onServerFilterChange={() => {}}
            />
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-appearance-in">
            <CreateApplicationModal onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
