import { Link as RouterLink } from 'react-router';
import { Button } from '../button';
import { Link } from '../Link';

import { H1, H6 } from '../typography';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen border border-border flex items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
      <div className="text-center">
        <H6 className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
          404
        </H6>
        <H1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-secondary-text sm:text-7xl dark:text-white">
          Page not found
        </H1>
        <p className="mt-6 text-lg font-medium text-pretty text-secondary-text sm:text-xl/8 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="md" variant="solid">
            <RouterLink to="/home/dashboard">Go back home</RouterLink>
          </Button>
          <Link to="/support">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      );
    </div>
  );
};
