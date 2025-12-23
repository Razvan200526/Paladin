import { Button } from '@common/components/button';
import { ResetIcon } from '@common/icons/ResetIcon';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { cn } from '@heroui/react';

type FilterHeaderProps = {
  activeFilterCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
  totalCount: number;
  isLoading: boolean;
  resourceLabel: string;
  resourceLabelPlural: string;
};

export const FilterHeader = ({
  activeFilterCount,
  hasActiveFilters,
  onReset,
  totalCount,
  isLoading,
  resourceLabel,
  resourceLabelPlural,
}: FilterHeaderProps) => {
  return (
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
            onPress={onReset}
            className="text-xs text-primary-600 hover:text-primary hover:bg-primary/10"
            isIconOnly
          >
            <ResetIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            isLoading ? 'bg-amber-500 animate-pulse' : 'bg-primary',
          )}
        />
        <p className="text-xs text-primary-700 font-medium">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <span className="font-bold text-secondary">{totalCount}</span>{' '}
              {totalCount === 1 ? resourceLabel : resourceLabelPlural} found
            </>
          )}
        </p>
      </div>
    </div>
  );
};
