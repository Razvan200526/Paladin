import { Button } from '@common/components/button';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import {
  addToast,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@heroui/react';
import { UserRoundSearchIcon } from 'lucide-react';
import { useState } from 'react';
import {
  useFetchExternalJobs,
  useJobCategories,
  useRefreshJobMatches,
} from '../../hooks';

interface ImportJobsButtonProps {
  userId?: string;
  onSuccess?: () => void;
}

const DEFAULT_CATEGORIES = ['software-dev', 'data', 'devops', 'design'];

export const ImportJobsButton = ({
  userId,
  onSuccess,
}: ImportJobsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

            setIsOpen(false);

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
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<UserRoundSearchIcon className="w-4 h-4" />}
        >
          Find Jobs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-64">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Import External Jobs</span>
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-muted" />
          </div>

          {isLoadingCategories ? (
            <div className="flex items-center gap-2 text-default-400 p-2">
              <Spinner size="sm" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            <CheckboxGroup
              label="Categories"
              value={selectedCategories}
              onValueChange={setSelectedCategories}
              size="sm"
              classNames={{
                wrapper: 'gap-1',
                label: 'text-xs text-muted',
              }}
            >
              {categories.map((cat) => (
                <Checkbox key={cat.value} value={cat.value}>
                  {cat.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}

          <Button
            size="sm"
            color="primary"
            className="w-full"
            isLoading={isLoading}
            onPress={handleFetchJobs}
            isDisabled={selectedCategories.length === 0}
          >
            {isFetching
              ? 'Fetching...'
              : isRefreshing
                ? 'Matching...'
                : 'Import Jobs'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
