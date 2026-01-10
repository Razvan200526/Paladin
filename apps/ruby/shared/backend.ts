import { Toast } from '@common/components/toast';
import { Backend } from '@sdk/backend';
import { Fetcher, type FetcherConfigType } from '@sdk/Fetcher';

const fetcher = new Fetcher({
  baseURL: process.env.APP_URL || 'http://localhost:3000',
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
