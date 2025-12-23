import type { JobMatch } from '@client/sdk/JobFetcher';
import { ScrollShadow, Spinner } from '@heroui/react';
import { JobListEmptyState } from './JobListEmptyState';
import { JobMatchCard } from './JobMatchCard';

interface JobListPanelProps {
  matches: JobMatch[];
  filteredMatches: JobMatch[];
  isLoading: boolean;
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
  onRefresh: () => void;
  userId?: string;
  hasFilters: boolean;
}

export const JobListPanel = ({
  matches,
  filteredMatches,
  isLoading,
  selectedMatchId,
  onSelectMatch,
  onRefresh,
  userId,
  hasFilters,
}: JobListPanelProps) => {
  return (
    <div className="w-full lg:w-96 border-r border-border bg-background flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredMatches.length === 0 ? (
        <JobListEmptyState
          hasFilters={hasFilters}
          userId={userId}
          onSuccess={onRefresh}
        />
      ) : (
        <ScrollShadow size={8} className="flex-1">
          <div className="p-2 space-y-2">
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
