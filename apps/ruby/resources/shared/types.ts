export type BaseResource = {
  id: string;
  name: string;
  url: string;
  isReady: boolean;
  state: 'ready' | 'processing' | 'failed';
  uploadedAt: Date;
  createdAt?: Date;
};

export type ResourceType = 'resumes' | 'coverLetters' | 'applications';

export type SortByOption = {
  value: string;
  label: string;
};

export type DateRangeOption = {
  value: string;
  label: string;
};

export type StateOption = {
  value: string;
  label: string;
  color?: string;
};

export type ResourceFilters = {
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: string;
  state: string;
};

export type ResourceFilterParams = {
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  date_range?: string;
  state?: string;
  page?: number;
  limit?: number;
};

export type FilterConfig = {
  resourceType: ResourceType;
  resourceLabel: string;
  resourceLabelPlural: string;
  accentColor: string;
  sortByOptions: SortByOption[];
  dateRangeOptions: DateRangeOption[];
  stateOptions: StateOption[];
  defaultFilters: ResourceFilters;
};
