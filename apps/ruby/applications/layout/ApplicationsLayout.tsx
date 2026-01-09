import { Button } from '@common/components/button';
import { NumberChip } from '@common/components/chips/NumberChip';
import { NumberChipSkeleton } from '@common/components/chips/NumberChipSkeleton';
import { H4 } from '@common/components/typography';
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { applicationFilterConfig } from '@ruby/resources/shared/filterConfigs';
import { filterAndSortApplications } from '@ruby/resources/shared/filterUtils';
import { useAuth } from '@ruby/shared/hooks';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router';
import type { ApplicationType } from '../../../sdk/types';
import { useApplicationFilterStore } from '../applicationStore';
import { ApplicationFilterSidebar } from '../components/ApplicationFilterSidebar';
import { CreateApplicationModal } from '../components/modals/CreateApplicationModal';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
  const isInspectPage =
    pathParts.length > 1 && pathParts[1].length > 0 && pathParts[1] !== '';
  const showFilterSidebar = !isInspectPage;
  const sidebarFilteredCount = filteredApplications?.length || 0;

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      {/* Navigation Bar */}
      <nav className="px-2 sm:px-4 py-2 sm:py-4 flex flex-row items-center justify-between w-full border-b border-border bg-background gap-2">
        <div className="flex items-center justify-center gap-2">
          <H4 className="text-sm sm:text-base">Applications</H4>
          {applicationsLoading ? (
            <NumberChipSkeleton />
          ) : (
            <NumberChip value={applications?.length || 0} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Filter toggle button - visible on mobile only */}
          {showFilterSidebar && (
            <Button
              variant="light"
              isIconOnly
              color="primary"
              radius="full"
              size="sm"
              className="lg:hidden"
              onPress={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FunnelIcon className="size-4" />
            </Button>
          )}

          {/* Add button */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Content Area */}
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

        {/* Filter Sidebar - Desktop (always visible on lg+) */}
        {showFilterSidebar && (
          <div className="hidden lg:block py-2 pr-2 shrink-0">
            <ApplicationFilterSidebar
              config={applicationFilterConfig}
              filteredCount={sidebarFilteredCount}
              isLoading={applicationsLoading}
              onServerFilterChange={() => {}}
            />
          </div>
        )}

        {/* Mobile Filter Overlay */}
        {showFilterSidebar && showMobileFilters && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Slide-in Panel */}
            <div
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-xs bg-background shadow-xl overflow-y-auto"
              style={{ animation: 'slideInFromRight 0.2s ease-out' }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-sm">Filters</span>
                <Button
                  variant="light"
                  isIconOnly
                  radius="full"
                  size="sm"
                  onPress={() => setShowMobileFilters(false)}
                >
                  <XMarkIcon className="size-5" />
                </Button>
              </div>
              <div className="p-2">
                <ApplicationFilterSidebar
                  config={applicationFilterConfig}
                  filteredCount={sidebarFilteredCount}
                  isLoading={applicationsLoading}
                  onServerFilterChange={() => {
                    setShowMobileFilters(false);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Application Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div className="w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-appearance-in">
            <CreateApplicationModal onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
