import '@fontsource/montserrat/100.css';
import '@fontsource/montserrat/200.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '../logo.svg';
import { ToastProvider } from '@common/components/toast';
import { PostHogProvider } from '@posthog/react';
import { queryClient } from '@ruby/shared/QueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import posthog from 'posthog-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './routes';

if (process.env.NODE_ENV === 'production') {
  posthog.init(process.env.APP_POSTHOG_KEY, {
    api_host: '/t',
    ui_host: process.env.APP_POSTHOG_HOST,
    defaults: '2025-11-30',
  });
}

const render = () => {
  const elem = document.getElementById('root');
  if (!elem) {
    throw new Error('Root element not found');
  }

  const root = createRoot(elem);
  root.render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </PostHogProvider>
    </StrictMode>,
  );
};

try {
  render();
} catch (error) {
  console.error(error);
}
