import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
  addToast,
  Button,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@heroui/react';
import { useState } from 'react';
import {
  useFetchExternalJobs,
  useJobCategories,
  useRefreshJobMatches,
} from '../hooks';

interface FetchExternalJobsProps {
  userId?: string;
  onSuccess?: () => void;
}

const DEFAULT_CATEGORIES = ['software-dev', 'data', 'devops', 'design'];

export const FetchExternalJobs = ({
  userId,
  onSuccess,
}: FetchExternalJobsProps) => {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useJobCategories();
  const { mutate: fetchJobs, isPending: isFetching } = useFetchExternalJobs();
  const { mutate: refreshMatches, isPending: isRefreshing } =
    useRefreshJobMatches();

  const isLoading = isFetching || isRefreshing;

  const handleFetchJobs = () => {
    fetchJobs(
      {
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        limit: 50,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            const { total, sources } = response.data;
            const sourceDetails = Object.entries(sources)
              .map(([name, count]) => `${name}: ${count}`)
              .join(', ');

            addToast({
              title: 'Jobs Fetched Successfully',
              description: `Found ${total} new jobs (${sourceDetails}). Calculating matches...`,
              color: 'success',
            });

            // Now refresh matches for this user
            if (userId) {
              refreshMatches(userId, {
                onSuccess: (matchResult) => {
                  if (matchResult.success && matchResult.data) {
                    addToast({
                      title: 'Matches Updated',
                      description: `Found ${matchResult.data.newMatches} new job matches!`,
                      color: 'success',
                    });
                  }
                  onSuccess?.();
                },
                onError: () => {
                  addToast({
                    title: 'Match Calculation Failed',
                    description:
                      'Jobs were fetched but match calculation failed. Try refreshing.',
                    color: 'warning',
                  });
                  onSuccess?.();
                },
              });
            } else {
              onSuccess?.();
            }
          } else {
            addToast({
              title: 'No New Jobs',
              description: 'No new jobs found. Try different categories.',
              color: 'warning',
            });
          }
        },
        onError: (error) => {
          addToast({
            title: 'Error Fetching Jobs',
            description: error.message,
            color: 'danger',
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <CloudArrowDownIcon className="w-6 h-6 text-primary" />
      </div>
      <p className="text-sm text-muted text-center max-w-xs">
        Import jobs from external sources to find matches
      </p>
      <div className="flex items-center gap-2">
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button
              size="sm"
              variant="flat"
              startContent={<AdjustmentsHorizontalIcon className="w-4 h-4" />}
            >
              Categories
              {selectedCategories.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-3 w-64">
            {isLoadingCategories ? (
              <div className="flex items-center gap-2 text-default-400 p-2">
                <Spinner size="sm" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <CheckboxGroup
                label="Job categories"
                value={selectedCategories}
                onValueChange={setSelectedCategories}
                size="sm"
                classNames={{
                  wrapper: 'gap-1',
                }}
              >
                {categories.map((cat) => (
                  <Checkbox key={cat.value} value={cat.value}>
                    {cat.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          color="primary"
          isLoading={isLoading}
          startContent={!isLoading && <ArrowPathIcon className="w-4 h-4" />}
          onPress={handleFetchJobs}
        >
          {isFetching
            ? 'Fetching...'
            : isRefreshing
              ? 'Matching...'
              : 'Import Jobs'}
        </Button>
      </div>
    </div>
  );
};
