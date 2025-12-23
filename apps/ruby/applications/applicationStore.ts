import {
  type ApplicationFilters,
  defaultApplicationFilters,
} from '@ruby/resources/shared/filterUtils';
import type { ApplicationType } from '@sdk/types';
import { create } from 'zustand';

type ApplicationFilterStoreType = {
  applicationFilters: ApplicationFilters;
  isFilteringApplications: boolean;

  filteredApplications: ApplicationType[] | null;

  setApplicationFilters: (filters: ApplicationFilters) => void;
  setFilters: (filters: ApplicationFilters) => void;
  resetFilters: () => void;
  getFilters: () => ApplicationFilters;

  setFilteredApplications: (resumes: ApplicationType[] | null) => void;
  setIsFilteringApplications: (isFiltering: boolean) => void;
};

export const useApplicationFilterStore = create<ApplicationFilterStoreType>(
  (set, get) => ({
    applicationFilters: { ...defaultApplicationFilters },
    filteredApplications: null,
    isFilteringApplications: false,

    setApplicationFilters: (filters) => set({ applicationFilters: filters }),
    setFilteredApplications: (applications) =>
      set({ filteredApplications: applications }),
    setIsFilteringApplications: (isFiltering) =>
      set({ isFilteringApplications: isFiltering }),

    setFilters: (filters) => {
      set({ applicationFilters: filters });
    },
    resetFilters: () => {
      set({
        applicationFilters: { ...defaultApplicationFilters },
        filteredApplications: null,
      });
    },
    getFilters: () => {
      const state = get();
      return state.applicationFilters;
    },
  }),
);
