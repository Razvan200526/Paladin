import '@fontsource/montserrat/100.css';
import '@fontsource/montserrat/200.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';

import { ToastProvider } from '@common/components/toast';
import { queryClient } from '@ruby/shared/QueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './routes';

const render = () => {
  const elem = document.getElementById('root');
  if (!elem) {
    throw new Error('Root element not found');
  }

  const root = createRoot(elem);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </StrictMode>,
  );
};

try {
  render();
} catch (error) {
  console.error(error);
}
