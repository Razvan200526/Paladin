import type { ApplicationType } from '@sdk/types';
import type { BaseResource, ResourceFilters } from './types';

/**
 * Filters and sorts resources based on the provided filters
 * Works with any resource type that extends BaseResource
 */
export const filterAndSortResources = <T extends BaseResource>(
  resources: T[],
  filters: ResourceFilters,
): T[] => {
  let filtered = [...resources];

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((resource) =>
      resource.name.toLowerCase().includes(query),
    );
  }

  if (filters.dateRange !== 'all') {
    const now = new Date();
    const filterDate = getFilterDate(now, filters.dateRange);

    filtered = filtered.filter((resource) => {
      const uploadDate = new Date(resource.uploadedAt);
      return uploadDate >= filterDate;
    });
  }

  if (filters.state !== 'all') {
    filtered = filtered.filter((resource) => resource.state === filters.state);
  }

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'uploadedAt':
        comparison =
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'createdAt': {
        const aDate = a.createdAt
          ? new Date(a.createdAt)
          : new Date(a.uploadedAt);
        const bDate = b.createdAt
          ? new Date(b.createdAt)
          : new Date(b.uploadedAt);
        comparison = aDate.getTime() - bDate.getTime();
        break;
      }
      default:
        comparison = 0;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

/**
 * Gets the filter date based on the date range selection
 */
const getFilterDate = (now: Date, dateRange: string): Date => {
  const date = new Date(now);

  switch (dateRange) {
    case 'today':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3months':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setFullYear(1970); // Beginning of time
  }

  return date;
};

/**
 * Builds server filter params from local filters
 * Only includes non-default values
 */
export const buildServerParams = (
  filters: ResourceFilters,
  defaultFilters: ResourceFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  if (filters.searchQuery) {
    params.search = filters.searchQuery;
  }
  if (filters.sortBy !== defaultFilters.sortBy) {
    params.sort_by = filters.sortBy;
  }
  if (filters.sortOrder !== defaultFilters.sortOrder) {
    params.sort_order = filters.sortOrder;
  }
  if (filters.dateRange !== defaultFilters.dateRange) {
    params.date_range = filters.dateRange;
  }
  if (filters.state !== defaultFilters.state) {
    params.state = filters.state;
  }

  return params;
};

/**
 * Application-specific types and utilities
 */

export type ApplicationFilters = {
  searchQuery: string;
  sortBy: 'jobTitle' | 'employer' | 'location' | 'createdAt' | 'status';
  sortOrder: 'asc' | 'desc';
  dateRange: 'all' | 'today' | 'week' | 'month' | '3months' | 'year';
  status: 'all' | 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  platform?: 'all' | 'Linkedin' | 'Glassdoor' | 'Other';
};

/**
 * Filters and sorts applications based on the provided filters
 */
export const filterAndSortApplications = (
  applications: ApplicationType[],
  filters: ApplicationFilters,
): ApplicationType[] => {
  let filtered = [...applications];

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.employer.toLowerCase().includes(query) ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.location.toLowerCase().includes(query),
    );
  }

  if (filters.dateRange !== 'all') {
    const now = new Date();
    const filterDate = getFilterDate(now, filters.dateRange);

    filtered = filtered.filter((app) => {
      const createdDate = new Date(app.createdAt);
      return createdDate >= filterDate;
    });
  }

  if (filters.status !== 'all') {
    filtered = filtered.filter((app) => app.status === filters.status);
  }

  if (filters.platform && filters.platform !== 'all') {
    filtered = filtered.filter((app) => app.platform === filters.platform);
  }

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'jobTitle':
        comparison = a.jobTitle.localeCompare(b.jobTitle);
        break;
      case 'employer':
        comparison = a.employer.localeCompare(b.employer);
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      case 'createdAt':
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'status': {
        const statusOrder = {
          Applied: 1,
          Interviewing: 2,
          Accepted: 3,
          Rejected: 4,
        };
        // @ts-ignore
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      }
      default:
        comparison = 0;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

/**
 * Default application filters
 */
export const defaultApplicationFilters: ApplicationFilters = {
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  dateRange: 'all',
  status: 'all',
  platform: 'all',
};

/**
 * Builds server filter params from local filters for applications
 */
export const buildApplicationServerParams = (
  filters: ApplicationFilters,
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.searchQuery) {
    params.search = filters.searchQuery;
  }
  if (filters.sortBy !== defaultApplicationFilters.sortBy) {
    params.sort_by = filters.sortBy;
  }
  if (filters.sortOrder !== defaultApplicationFilters.sortOrder) {
    params.sort_order = filters.sortOrder;
  }
  if (filters.dateRange !== defaultApplicationFilters.dateRange) {
    params.date_range = filters.dateRange;
  }
  if (filters.status !== defaultApplicationFilters.status) {
    params.status = filters.status;
  }
  if (
    filters.platform &&
    filters.platform !== defaultApplicationFilters.platform
  ) {
    params.platform = filters.platform;
  }

  return params;
};
