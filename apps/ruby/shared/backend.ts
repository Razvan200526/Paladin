import { Toast } from '@common/components/toast';
import { Backend } from '@sdk/backend';
import { Fetcher, type FetcherConfigType } from '@sdk/Fetcher';

const fetcher = new Fetcher({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  beforeSend: (config: FetcherConfigType) => ({
    ...config,
    headers: {
      ...config.headers,
    },
  }),
  onServerError: (message: string) => {
    Toast.error({
      title: 'Server Error',
      description: message,
    });
  },
});
fetcher.configure({
  headers: {},
});

export const backend = new Backend(fetcher);
