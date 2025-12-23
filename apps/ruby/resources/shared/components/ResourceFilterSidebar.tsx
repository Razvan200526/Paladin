import { Button } from '@common/components/button';
import type { InputEmailRefType } from '@common/components/input/InputSearch';
import { InputSearch } from '@common/components/input/InputSearch';
import { Selector } from '@common/components/select/Selector';
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { useFilterCoverletters, useFilterResumes } from '@ruby/resources/hooks';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { useFilterStore } from '../filterStore';
import { buildServerParams } from '../filterUtils';
import type {
  FilterConfig,
  ResourceFilterParams,
  ResourceFilters,
} from '../types';
import { CollapsibleSection } from './CollapsibleSection';
import { DateRangeFilter } from './DateRangeFilter';
import { FilterHeader } from './FilterHeader';
import { StateFilter } from './StateFilter';

type ResourceFilterSidebarProps = {
  config: FilterConfig;
  filteredCount: number;
  isLoading?: boolean;
  onServerFilterChange?: (params: ResourceFilterParams) => void;
};

export const ResourceFilterSidebar = ({
  config,
  filteredCount,
  isLoading = false,
  onServerFilterChange,
}: ResourceFilterSidebarProps) => {
  const {
    resumeFilters,
    coverLetterFilters,
    setResumeFilters,
    setFilteredResumes,
    setFilteredCoverLetters,
    setCoverLetterFilters,
    setIsFilteringResumes,
    setIsFilteringCoverLetters,
  } = useFilterStore();

  const { data: user } = useAuth();
  const { mutateAsync: filterResumes, isPending: isFilteringResumes } =
    useFilterResumes(user?.id || '');
  const {
    mutateAsync: filterCoverLetters,
    isPending: isFilteringCoverLetters,
  } = useFilterCoverletters(user?.id || '');

  const storeFilters =
    config.resourceType === 'resumes' ? resumeFilters : coverLetterFilters;
  const setStoreFilters =
    config.resourceType === 'resumes'
      ? setResumeFilters
      : setCoverLetterFilters;

  const [localFilters, setLocalFilters] =
    useState<ResourceFilters>(storeFilters);

  const searchInputRef = useRef<InputEmailRefType | null>(null);

  const handleLocalFilterChange = (
    key: keyof ResourceFilters,
    value: string,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    const searchQuery = searchInputRef.current?.getValue() || '';
    const newFilters = { ...localFilters, searchQuery };

    setStoreFilters(newFilters);

    if (config.resourceType === 'resumes') {
      setIsFilteringResumes(true);
      try {
        const res = await filterResumes({ filters: newFilters });
        setFilteredResumes(res.data?.resumes || []);
      } catch (error) {
        console.error('Error filtering resumes:', error);
      } finally {
        setIsFilteringResumes(false);
      }
    } else {
      setIsFilteringCoverLetters(true);
      try {
        const res = await filterCoverLetters({ filters: newFilters });
        setFilteredCoverLetters(res.data?.coverletters || []);
      } catch (error) {
        console.error('Error filtering cover letters:', error);
      } finally {
        setIsFilteringCoverLetters(false);
      }
    }

    onServerFilterChange?.(
      buildServerParams(newFilters, config.defaultFilters),
    );
  };

  const handleReset = () => {
    setLocalFilters(config.defaultFilters);
    searchInputRef.current?.setValue('');
    setStoreFilters(config.defaultFilters);
    if (config.resourceType === 'resumes') {
      setFilteredResumes(null);
    } else {
      setFilteredCoverLetters(null);
    }
    onServerFilterChange?.({});
  };

  const hasActiveFilters =
    localFilters.searchQuery !== '' ||
    localFilters.sortBy !== config.defaultFilters.sortBy ||
    localFilters.sortOrder !== config.defaultFilters.sortOrder ||
    localFilters.dateRange !== config.defaultFilters.dateRange ||
    localFilters.state !== config.defaultFilters.state;

  const activeFilterCount = [
    localFilters.searchQuery !== '',
    localFilters.sortBy !== config.defaultFilters.sortBy ||
      localFilters.sortOrder !== config.defaultFilters.sortOrder,
    localFilters.dateRange !== config.defaultFilters.dateRange,
    localFilters.state !== config.defaultFilters.state,
  ].filter(Boolean).length;

  const sortOrderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const isApplying = isFilteringResumes || isFilteringCoverLetters;

  return (
    <div className="my-2 w-72 flex flex-col bg-background rounded border border-border h-fit overflow-hidden">
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
            selectedKeys={[localFilters.sortBy]}
            onSelectionChange={(value) =>
              handleLocalFilterChange('sortBy', Array.from(value)[0] as string)
            }
            items={config.sortByOptions}
            size="sm"
          />
          <Selector
            label="Order"
            placeholder="Select order"
            selectedKeys={[localFilters.sortOrder]}
            onSelectionChange={(value) =>
              handleLocalFilterChange(
                'sortOrder',
                Array.from(value)[0] as 'asc' | 'desc',
              )
            }
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
            options={config.stateOptions}
            selectedValue={localFilters.state}
            onSelect={(value) => handleLocalFilterChange('state', value)}
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
