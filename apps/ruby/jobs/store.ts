import type { MatchStatus } from '@sdk/JobFetcher';
import { create } from 'zustand';

// Tab keys that can be selected - 'high' is special (score-based, not status)
export type JobTabKey = MatchStatus | 'all' | 'high';

interface JobsFilters {
  tab: JobTabKey;
  status: MatchStatus | 'all';
  minScore: number;
  sortBy: 'score' | 'date' | 'company';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  remoteOnly: boolean;
}

interface JobsState {
  filters: JobsFilters;
  selectedMatchId: string | null;
  isPreferencesOpen: boolean;
  isRefreshing: boolean;
}

interface JobsActions {
  setFilter: <K extends keyof JobsFilters>(
    key: K,
    value: JobsFilters[K],
  ) => void;
  resetFilters: () => void;
  setSelectedMatchId: (id: string | null) => void;
  setPreferencesOpen: (open: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
}

const defaultFilters: JobsFilters = {
  tab: 'all',
  status: 'all',
  minScore: 0,
  sortBy: 'score',
  sortOrder: 'desc',
  searchQuery: '',
  remoteOnly: false,
};

// Helper to derive status and minScore from tab selection
// Note: 'high' threshold must match JobsController.getMatchStats (which uses 70)
export const getFiltersFromTab = (
  tab: JobTabKey,
): { status: MatchStatus | 'all'; minScore: number } => {
  switch (tab) {
    case 'high':
      return { status: 'all', minScore: 70 };
    case 'new':
    case 'saved':
    case 'applied':
    case 'viewed':
    case 'dismissed':
      return { status: tab, minScore: 0 };
    case 'all':
    default:
      return { status: 'all', minScore: 0 };
  }
};

export const useJobsStore = create<JobsState & JobsActions>((set) => ({
  filters: defaultFilters,
  selectedMatchId: null,
  isPreferencesOpen: false,
  isRefreshing: false,

  setFilter: (key, value) =>
    set((state) => {
      // When tab changes, also update status and minScore accordingly
      if (key === 'tab') {
        const { status, minScore } = getFiltersFromTab(value as JobTabKey);
        return {
          filters: {
            ...state.filters,
            tab: value as JobTabKey,
            status,
            minScore,
          },
        };
      }
      return {
        filters: { ...state.filters, [key]: value },
      };
    }),

  resetFilters: () =>
    set(() => ({
      filters: defaultFilters,
    })),

  setSelectedMatchId: (id) =>
    set(() => ({
      selectedMatchId: id,
    })),

  setPreferencesOpen: (open) =>
    set(() => ({
      isPreferencesOpen: open,
    })),

  setRefreshing: (refreshing) =>
    set(() => ({
      isRefreshing: refreshing,
    })),
}));
