import { ScrollShadow, Spinner } from '@heroui/react';
import type { JobMatch } from '@sdk/JobFetcher';
import { JobListEmptyState } from './JobListEmptyState';
import { JobMatchCard } from './JobMatchCard';

interface JobListPanelProps {
  matches: JobMatch[];
  filteredMatches: JobMatch[];
  isLoading: boolean;
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
  hasFilters: boolean;
}

export const JobListPanel = ({
  matches,
  filteredMatches,
  isLoading,
  selectedMatchId,
  onSelectMatch,
  hasFilters,
}: JobListPanelProps) => {
  return (
    <div className="w-full lg:w-96 lg:border-r border-border bg-background flex flex-col shrink-0">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredMatches.length === 0 ? (
        <JobListEmptyState hasFilters={hasFilters} />
      ) : (
        <ScrollShadow size={8} className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-3 space-y-2">
            {filteredMatches.map((match) => (
              <JobMatchCard
                key={match.id}
                match={match}
                isSelected={match.id === selectedMatchId}
                onClick={() => onSelectMatch(match.id)}
              />
            ))}
          </div>
        </ScrollShadow>
      )}

      {matches.length > 0 && (
        <div className="p-2 border-t border-border text-center">
          <p className="text-xs font-semibold text-primary">
            Showing{' '}
            <span className="text-secondary-text">
              {filteredMatches.length}
            </span>{' '}
            of <span className="text-secondary-text">{matches.length}</span>{' '}
            matches
          </p>
        </div>
      )}
    </div>
  );
};
