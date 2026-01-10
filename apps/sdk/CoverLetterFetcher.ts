import type { ResourceFilters } from '@ruby/resources/shared';
import { queryClient } from '@ruby/shared/QueryClient';
import { Toast } from '../common/components/toast';
import type { Fetcher } from './Fetcher';
import { Socket } from './Socket';
import type {
  CoverLetterType,
  ResponseType,
  ResumeChatResponseType,
  SocketResponseType,
} from './types';

/**
 * Get WebSocket URL based on current browser location
 */
function getWsUrl(): string {
  if (typeof window === 'undefined') {
    return `${process.env.APP_WS_URL}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}`;
}

export class CoverLetterFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly coverletter = {
    retrieve: async (payload: { userId: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/coverletters/${payload.userId}`);
    },
    filter: async (payload: {
      filters: ResourceFilters;
      userId: string;
    }): Promise<ResponseType<{ coverletters: CoverLetterType[] }>> => {
      const params = new URLSearchParams(
        Object.entries(payload.filters).map(([k, v]) => [k, String(v)]),
      );
      return this.fetcher.get(
        `/api/resumes/${payload.userId}/filter?${params.toString()}`,
      );
    },

    get: async (payload: { id: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/coverletters/single/${payload.id}`);
    },
    delete: async (payload: {
      coverletterIds: string[];
      userId: string;
    }): Promise<ResponseType> => {
      return this.fetcher.delete('/api/coverletter/delete', payload);
    },

    rename: async (payload: {
      coverletterId: string;
      newName: string;
    }): Promise<ResponseType> => {
      return this.fetcher.patch(
        `/api/coverletter/${payload.coverletterId}/rename`,
        { newName: payload.newName },
      );
    },
    getSuggestions: async (payload: { id: string }): Promise<ResponseType> => {
      const res = this.fetcher.get(
        `/api/suggestions/coverletter/${payload.id}`,
      );
      return res;
    },
  };

  public readonly create = async (payload: { url: string }) => {
    const socket = new Socket(getWsUrl());

    socket.on<{ coverletter: CoverLetterType }>('message', (response) => {
      queryClient.invalidateQueries();

      const isReady = response.data.coverletter.isReady;
      const isFailed = response.data.coverletter.state === 'failed';

      if (isReady || isFailed) {
        socket.close();
      }

      if (isReady) {
        Toast.success({ description: 'Coverletter uploaded sucessfully' });
      }

      socket.send({
        channelName: 'coverletter:create',
        data: {
          url: payload.url,
        },
      });
    });

    Toast.info({ description: 'Uploading coverletter' });
  };

  public readonly chat = (payload: {
    coverletterId: string;
    query: string;
    onMessage: (
      response: SocketResponseType<ResumeChatResponseType>,
      ws: Socket,
    ) => void;
  }) => {
    const socket = new Socket(`${getWsUrl()}/ws/document-chat`);
    socket.on(
      'message',
      (response: SocketResponseType<ResumeChatResponseType>) => {
        payload.onMessage(response, socket);
      },
    );
    socket.send({
      channelName: 'coverletter:chat',
      data: {
        coverletterId: payload.coverletterId,
        query: payload.query,
      },
    });
    return socket;
  };
}
