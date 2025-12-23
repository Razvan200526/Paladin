import type { CoverLetterType, ResumeType } from '@sdk/types';
import { create } from 'zustand';
import type { ResourceFilters, ResourceType } from './types';

const defaultFilters: ResourceFilters = {
  searchQuery: '',
  sortBy: 'uploadedAt',
  sortOrder: 'desc',
  dateRange: 'all',
  state: 'all',
};

type FilterStoreType = {
  resumeFilters: ResourceFilters;
  coverLetterFilters: ResourceFilters;

  filteredResumes: ResumeType[] | null;
  filteredCoverLetters: CoverLetterType[] | null;
  isFilteringResumes: boolean;
  isFilteringCoverLetters: boolean;

  setResumeFilters: (filters: ResourceFilters) => void;
  setCoverLetterFilters: (filters: ResourceFilters) => void;
  setFilters: (resourceType: ResourceType, filters: ResourceFilters) => void;
  resetFilters: (resourceType: ResourceType) => void;
  getFilters: (resourceType: ResourceType) => ResourceFilters;

  setFilteredResumes: (resumes: ResumeType[] | null) => void;
  setFilteredCoverLetters: (coverLetters: CoverLetterType[] | null) => void;
  setIsFilteringResumes: (isFiltering: boolean) => void;
  setIsFilteringCoverLetters: (isFiltering: boolean) => void;
};

export const useFilterStore = create<FilterStoreType>((set, get) => ({
  resumeFilters: { ...defaultFilters },
  coverLetterFilters: { ...defaultFilters },
  filteredResumes: null,
  filteredCoverLetters: null,
  isFilteringResumes: false,
  isFilteringCoverLetters: false,

  setResumeFilters: (filters) => set({ resumeFilters: filters }),
  setCoverLetterFilters: (filters) => set({ coverLetterFilters: filters }),
  setFilteredResumes: (resumes) => set({ filteredResumes: resumes }),
  setFilteredCoverLetters: (coverLetters) =>
    set({ filteredCoverLetters: coverLetters }),
  setIsFilteringResumes: (isFiltering) =>
    set({ isFilteringResumes: isFiltering }),
  setIsFilteringCoverLetters: (isFiltering) =>
    set({ isFilteringCoverLetters: isFiltering }),

  setFilters: (resourceType, filters) => {
    if (resourceType === 'resumes') {
      set({ resumeFilters: filters });
    } else {
      set({ coverLetterFilters: filters });
    }
  },
  resetFilters: (resourceType) => {
    if (resourceType === 'resumes') {
      set({ resumeFilters: { ...defaultFilters }, filteredResumes: null });
    } else {
      set({
        coverLetterFilters: { ...defaultFilters },
        filteredCoverLetters: null,
      });
    }
  },
  getFilters: (resourceType) => {
    const state = get();
    return resourceType === 'resumes'
      ? state.resumeFilters
      : state.coverLetterFilters;
  },
}));
