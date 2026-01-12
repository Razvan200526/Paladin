import { Button } from '@common/components/button';
import type { InputEmailRefType } from '@common/components/input/InputSearch';
import { InputSearch } from '@common/components/input/InputSearch';
import { Selector } from '@common/components/select/Selector';
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
  CollapsibleSection,
  DateRangeFilter,
  FilterHeader,
  type ResourceFilterParams,
  StateFilter,
} from '@ruby/resources/shared';
import {
  type ApplicationFilters,
  buildApplicationServerParams,
} from '@ruby/resources/shared/filterUtils';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { useApplicationFilterStore } from '../applicationStore';
import { useFilterApplications } from '../hooks/applicationHooks';

type ResourceFilterSidebarProps = {
  config: typeof import('@ruby/resources/shared/filterConfigs').applicationFilterConfig;
  filteredCount: number;
  isLoading?: boolean;
  onServerFilterChange?: (params: ResourceFilterParams) => void;
};

export const ApplicationFilterSidebar = ({
  config,
  filteredCount,
  isLoading = false,
  onServerFilterChange,
}: ResourceFilterSidebarProps) => {
  const {
    applicationFilters,
    setApplicationFilters,
    setFilteredApplications,
    setIsFilteringApplications,
  } = useApplicationFilterStore();

  const { data: user } = useAuth();
  const {
    mutateAsync: filterApplications,
    isPending: isFilteringApplications,
  } = useFilterApplications(user?.id || '');

  const [localFilters, setLocalFilters] =
    useState<ApplicationFilters>(applicationFilters);

  const searchInputRef = useRef<InputEmailRefType | null>(null);

  const handleLocalFilterChange = (
    key: keyof ApplicationFilters,
    value: string,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    const searchQuery = searchInputRef.current?.getValue() || '';
    const newFilters = { ...localFilters, searchQuery };

    setApplicationFilters(newFilters);

    setIsFilteringApplications(true);
    try {
      const res = await filterApplications({ filters: newFilters });
      setFilteredApplications(res.data || []);
    } catch (error) {
      console.error('Error filtering applications:', error);
    } finally {
      setIsFilteringApplications(false);
    }

    onServerFilterChange?.(buildApplicationServerParams(newFilters));
  };

  const handleReset = () => {
    setLocalFilters(config.defaultFilters);
    searchInputRef.current?.setValue('');
    setApplicationFilters(config.defaultFilters);
    setFilteredApplications(null);
    onServerFilterChange?.({});
  };

  const hasActiveFilters =
    localFilters.searchQuery !== '' ||
    localFilters.sortBy !== config.defaultFilters.sortBy ||
    localFilters.sortOrder !== config.defaultFilters.sortOrder ||
    localFilters.dateRange !== config.defaultFilters.dateRange ||
    localFilters.status !== config.defaultFilters.status;

  const activeFilterCount = [
    localFilters.searchQuery !== '',
    localFilters.sortBy !== config.defaultFilters.sortBy ||
      localFilters.sortOrder !== config.defaultFilters.sortOrder,
    localFilters.dateRange !== config.defaultFilters.dateRange,
    localFilters.status !== config.defaultFilters.status,
  ].filter(Boolean).length;

  const sortOrderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const isApplying = isFilteringApplications;

  return (
    <div className="my-2 w-full lg:w-72 flex flex-col bg-background rounded border border-border h-fit overflow-hidden">
      <FilterHeader
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        totalCount={filteredCount}
        isLoading={isLoading || isApplying}
        resourceLabel={config.resourceLabel}
        resourceLabelPlural={config.resourceLabelPlural}
      />

      <div className="p-4 border-b border-border/50">
        <InputSearch
          ref={searchInputRef}
          name={`${config.resourceType}-search`}
          placeholder={`Search ${config.resourceLabelPlural}...`}
          className="w-full"
          size="sm"
          value={localFilters.searchQuery}
          onChange={(value) => handleLocalFilterChange('searchQuery', value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection
          title="Sort"
          icon={<AdjustmentsHorizontalIcon className="size-4" />}
          defaultOpen={true}
        >
          <Selector
            label="Sort by"
            placeholder="Select field"
            value={localFilters.sortBy}
            onChange={(value) => handleLocalFilterChange('sortBy', value)}
            items={config.sortByOptions}
            size="sm"
          />
          <Selector
            label="Order"
            placeholder="Select order"
            value={localFilters.sortOrder}
            onChange={(value) => handleLocalFilterChange('sortOrder', value)}
            items={sortOrderItems}
            size="sm"
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Date Range"
          icon={<CalendarDaysIcon className="size-4" />}
          defaultOpen={false}
        >
          <DateRangeFilter
            options={config.dateRangeOptions}
            selectedValue={localFilters.dateRange}
            onSelect={(value) => handleLocalFilterChange('dateRange', value)}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Status"
          icon={
            <div className="size-4 flex items-center justify-center">
              <div className="size-2.5 rounded-full bg-current" />
            </div>
          }
          defaultOpen={false}
        >
          <StateFilter
            options={config.statusOptions}
            selectedValue={localFilters.status}
            onSelect={(value) => handleLocalFilterChange('status', value)}
          />
        </CollapsibleSection>
      </div>

      <div className="p-4 border-t border-border/40 bg-primary-50/30">
        <Button
          className="w-full font-semibold"
          color="primary"
          size="sm"
          isLoading={isApplying}
          onPress={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
