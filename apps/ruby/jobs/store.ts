import type { MatchStatus } from '@client/sdk/JobFetcher';
import { create } from 'zustand';

interface JobsFilters {
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
  status: 'all',
  minScore: 0,
  sortBy: 'score',
  sortOrder: 'desc',
  searchQuery: '',
  remoteOnly: false,
};

export const useJobsStore = create<JobsState & JobsActions>((set) => ({
  filters: defaultFilters,
  selectedMatchId: null,
  isPreferencesOpen: false,
  isRefreshing: false,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

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
