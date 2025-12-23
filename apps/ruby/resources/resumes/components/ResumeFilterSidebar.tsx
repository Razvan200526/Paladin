import { Button } from '@common/components/button';
import { InputSearch } from '@common/components/input/InputSearch';
import { Selector } from '@common/components/select/Selector';
import { ResetIcon } from '@common/icons/ResetIcon';
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@heroui/react';
import { useState } from 'react';

export type ResumeFilters = {
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: string;
  state: string;
};

export type ResumeFilterParams = {
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  date_range?: string;
  state?: string;
  page?: number;
  limit?: number;
};

type ResumeFilterSidebarProps = {
  onFilterChange: (filters: ResumeFilters) => void;
  onServerFilterChange?: (params: ResumeFilterParams) => void;
  totalResumes: number;
  isLoading?: boolean;
};

const defaultFilters: ResumeFilters = {
  searchQuery: '',
  sortBy: 'uploadedAt',
  sortOrder: 'desc',
  dateRange: 'all',
  state: 'all',
};

type CollapsibleSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CollapsibleSection = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="light"
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span className="text-xs font-semibold tracking-wide uppercase">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="size-4 text-primary-400" />
        ) : (
          <ChevronDownIcon className="size-4 text-primary-400" />
        )}
      </Button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>
      </div>
    </div>
  );
};

export const ResumeFilterSidebar = ({
  onFilterChange,
  onServerFilterChange,
  totalResumes,
  isLoading = false,
}: ResumeFilterSidebarProps) => {
  const [filters, setFilters] = useState<ResumeFilters>(defaultFilters);

  const buildServerParams = (newFilters: ResumeFilters): ResumeFilterParams => {
    const params: ResumeFilterParams = {};

    if (newFilters.searchQuery) {
      params.search = newFilters.searchQuery;
    }
    if (newFilters.sortBy !== 'uploadedAt') {
      params.sort_by = newFilters.sortBy;
    }
    if (newFilters.sortOrder !== 'desc') {
      params.sort_order = newFilters.sortOrder;
    }
    if (newFilters.dateRange !== 'all') {
      params.date_range = newFilters.dateRange;
    }
    if (newFilters.state !== 'all') {
      params.state = newFilters.state;
    }

    return params;
  };

  const handleFilterChange = (key: keyof ResumeFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    onServerFilterChange?.(buildServerParams(newFilters));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onServerFilterChange?.({});
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.sortBy !== 'uploadedAt' ||
    filters.sortOrder !== 'desc' ||
    filters.dateRange !== 'all' ||
    filters.state !== 'all';

  const activeFilterCount = [
    filters.searchQuery !== '',
    filters.sortBy !== 'uploadedAt' || filters.sortOrder !== 'desc',
    filters.dateRange !== 'all',
    filters.state !== 'all',
  ].filter(Boolean).length;

  const sortByItems = [
    { value: 'name', label: 'Name' },
    { value: 'uploadedAt', label: 'Upload Date' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const sortOrderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const dateRangeItems = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: '3months', label: 'Past 3 Months' },
    { value: 'year', label: 'Past Year' },
  ];

  const stateItems = [
    { value: 'all', label: 'All States' },
    { value: 'ready', label: 'Ready' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="w-72 flex flex-col bg-light rounded-xl border border-border/40 h-fit shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-linear-to-br from-primary-50 to-primary-100/50 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <FunnelIcon className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="text-[10px] text-primary-600 font-medium">
                  {activeFilterCount} active
                </span>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="light"
              onPress={handleReset}
              className="text-xs text-primary-600 hover:text-primary hover:bg-primary/10"
              isIconOnly
            >
              <ResetIcon className="size-4" />
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isLoading ? 'bg-amber-500 animate-pulse' : 'bg-resume',
            )}
          />
          <p className="text-xs text-primary-700 font-medium">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                <span className="font-bold text-primary">{totalResumes}</span>{' '}
                {totalResumes === 1 ? 'resume' : 'resumes'} found
              </>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <InputSearch
          name="resume-search"
          placeholder="Search resumes..."
          className="w-full"
          size="sm"
          value={filters.searchQuery}
          onChange={(value) => handleFilterChange('searchQuery', value)}
        />
      </div>

      {/* Collapsible Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Sort Section */}
        <CollapsibleSection
          title="Sort"
          icon={<AdjustmentsHorizontalIcon className="size-4" />}
          defaultOpen={true}
        >
          <Selector
            label="Sort by"
            placeholder="Select field"
            selectedKeys={[filters.sortBy]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleFilterChange('sortBy', value);
            }}
            items={sortByItems}
            size="sm"
          />
          <Selector
            label="Order"
            placeholder="Select order"
            selectedKeys={[filters.sortOrder]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as 'asc' | 'desc';
              handleFilterChange('sortOrder', value);
            }}
            items={sortOrderItems}
            size="sm"
          />
        </CollapsibleSection>

        {/* Date Range Filter */}
        <CollapsibleSection
          title="Date Range"
          icon={<CalendarDaysIcon className="size-4" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-2">
            {dateRangeItems.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleFilterChange('dateRange', item.value)}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200',
                  filters.dateRange === item.value
                    ? 'bg-secondary-text/10 border-secondary text-secondary-text'
                    : 'bg-transparent border-border/50 text-primary hover:border-border-hover hover:bg-background',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* Status Filter */}
        <CollapsibleSection
          title="Status"
          icon={
            <div className="size-4 flex items-center justify-center">
              <div className="size-2.5 rounded-full bg-current" />
            </div>
          }
          defaultOpen={false}
        >
          <div className="flex flex-col gap-1.5">
            {stateItems.map((item) => {
              const isSelected = filters.state === item.value;
              const statusColors: Record<string, string> = {
                all: 'bg-primary',
                ready: 'bg-green-500',
                processing: 'bg-amber-500',
                failed: 'bg-red-500',
              };

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleFilterChange('state', item.value)}
                  className={cn(
                    'w-full px-3 py-2.5 text-xs font-medium rounded-lg border flex items-center gap-2.5 transition-all duration-200',
                    isSelected
                      ? 'bg-primary-100 border-primary-300 text-primary'
                      : 'bg-transparent border-border/50 text-primary-600 hover:border-primary-300 hover:bg-primary-50',
                  )}
                >
                  <div
                    className={cn(
                      'size-2 rounded-full',
                      statusColors[item.value],
                    )}
                  />
                  {item.label}
                  {isSelected && (
                    <div className="ml-auto size-4 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="size-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer - Apply button for server-side filtering */}
      {onServerFilterChange && (
        <div className="p-4 border-t border-border/40 bg-primary-50/30">
          <Button
            className="w-full font-semibold"
            color="primary"
            size="sm"
            isLoading={isLoading}
            onPress={() => onServerFilterChange(buildServerParams(filters))}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};
