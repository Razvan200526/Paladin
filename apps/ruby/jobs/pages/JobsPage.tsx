import { useAuth } from '@ruby/shared/hooks';
import { useEffect } from 'react';
import {
  JobDetailDrawer,
  JobDetailPanel,
  JobListPanel,
  JobPreferencesForm,
} from '../components';
import { JobPageHeader } from '../components/JobPageHeader';
import { useJobMatches, useJobPreferences } from '../hooks';
import { useJobsStore } from '../store';

export const JobsPage = () => {
  const { data: user } = useAuth();
  const userId = user?.id;

  const {
    filters,
    selectedMatchId,
    setSelectedMatchId,
    isPreferencesOpen,
    setPreferencesOpen,
  } = useJobsStore();

  const { data: matches = [], isLoading: isLoadingMatches } = useJobMatches(
    userId,
    {
      status: filters.status === 'all' ? undefined : filters.status,
      minScore: filters.minScore || undefined,
      limit: 50,
    },
  );

  const { data: preferences } = useJobPreferences(userId);
  // const { mutate: refreshMatches } = useRefreshJobMatches();

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  const filteredMatches = matches.filter((match) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        match.job.title.toLowerCase().includes(query) ||
        match.job.company.toLowerCase().includes(query) ||
        match.job.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const hasFilters =
    !!filters.searchQuery || filters.status !== 'all' || filters.minScore > 0;

  useEffect(() => {
    if (
      filteredMatches.length > 0 &&
      !selectedMatchId &&
      window.innerWidth >= 1024
    ) {
      setSelectedMatchId(filteredMatches[0].id);
    }
  }, [filteredMatches, selectedMatchId, setSelectedMatchId]);

  // const handleRefresh = () => {
  //   if (userId) {
  //     refreshMatches(userId);
  //   }
  // };

  return (
    <div className="h-[calc(100dvh-2rem)] m-4 rounded border border-border flex flex-col bg-background">
      <JobPageHeader />

      <div className="flex-1 flex overflow-hidden">
        <JobListPanel
          matches={matches}
          filteredMatches={filteredMatches}
          isLoading={isLoadingMatches}
          selectedMatchId={selectedMatchId}
          onSelectMatch={setSelectedMatchId}
          hasFilters={hasFilters}
        />

        <div className="hidden lg:flex flex-1 bg-background">
          <JobDetailPanel selectedMatch={selectedMatch} />
        </div>
      </div>

      <JobDetailDrawer
        selectedMatch={selectedMatch}
        onClose={() => setSelectedMatchId(null)}
      />

      <JobPreferencesForm
        isOpen={isPreferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        preferences={preferences ?? undefined}
      />
    </div>
  );
};
