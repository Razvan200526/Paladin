import { Button } from '@common/components/button';
import { NumberChip } from '@common/components/chips/NumberChip';
import { InputSearch } from '@common/components/input/InputSearch';
import { Selector } from '@common/components/select/Selector';
import { H6 } from '@common/components/typography';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@heroui/react';
import { useState } from 'react';
import type { MatchStatus } from '../../../sdk/JobFetcher';
import { useJobsStore } from '../store';

interface JobsFilterProps {
  className?: string;
}

const STATUS_OPTIONS: { value: MatchStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Matches' },
  { value: 'new', label: 'New' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'dismissed', label: 'Dismissed' },
];

export const JobsFilter = ({ className }: JobsFilterProps) => {
  const { filters, setFilter, resetFilters } = useJobsStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = [
    filters.minScore !== undefined && filters.minScore > 0,
    filters.status !== 'all',
  ].filter(Boolean).length;

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <InputSearch
          placeholder="Search jobs..."
          value={filters.searchQuery}
          onChange={(value) => setFilter('searchQuery', value)}
          className="w-64"
          size="sm"
        />
        <Selector
          placeholder="Status"
          value={filters.status}
          onChange={(selected) =>
            setFilter('status', selected as MatchStatus | 'all')
          }
          className="w-32"
          items={STATUS_OPTIONS}
        />

        <Popover isOpen={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="light"
              className="bg-background border border-border hover:border-border-hover"
              startContent={<FunnelIcon className="w-4 h-4" />}
            >
              Filters
              {activeFilterCount > 0 && (
                <NumberChip value={activeFilterCount} />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 py-4 bg-background border border-border">
            <div className="space-y-4">
              <H6 className="text-center">Advanced Filters</H6>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-secondary-text">
                    Minimum Score
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {filters.minScore}%
                  </span>
                </div>
                <Slider
                  size="md"
                  color="primary"
                  step={5}
                  minValue={0}
                  maxValue={100}
                  value={filters.minScore}
                  onChange={(value) => setFilter('minScore', value as number)}
                  className="max-w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-primary">Remote Only</span>
                <Checkbox
                  radius="sm"
                  type="checkbox"
                  checked={filters.remoteOnly}
                  onChange={(e) => setFilter('remoteOnly', e.target.checked)}
                  className="rounded"
                />
              </div>

              <div className="flex justify-between pt-2 border-t border-border">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => {
                    resetFilters();
                    setIsFilterOpen(false);
                  }}
                >
                  Clear All
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => setIsFilterOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {(filters.searchQuery ||
          filters.status !== 'all' ||
          filters.minScore > 0 ||
          filters.remoteOnly) && (
          <Button
            size="sm"
            variant="light"
            startContent={<XMarkIcon className="w-4 h-4" />}
            onPress={resetFilters}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
