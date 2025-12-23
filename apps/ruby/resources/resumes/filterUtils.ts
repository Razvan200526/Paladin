import type { ResumeType } from '@sdk/types';
import type { ResumeFilters } from './components/ResumeFilterSidebar';

/**
 * Filters and sorts resumes based on the provided filters
 */
export const filterAndSortResumes = (
  resumes: ResumeType[],
  filters: ResumeFilters,
): ResumeType[] => {
  let filtered = [...resumes];

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((resume) =>
      resume.name.toLowerCase().includes(query),
    );
  }

  // Apply date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    const filterDate = getFilterDate(now, filters.dateRange);

    filtered = filtered.filter((resume) => {
      const uploadDate = new Date(resume.uploadedAt);
      return uploadDate >= filterDate;
    });
  }

  // Apply state filter
  if (filters.state !== 'all') {
    filtered = filtered.filter((resume) => {
      if (filters.state === 'ready') return resume.state === 'ready';
      if (filters.state === 'processing') return resume.state === 'processing';
      if (filters.state === 'failed') return resume.state === 'failed';
      return true;
    });
  }

  // Apply sorting
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
      case 'createdAt':
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
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
