import type { ResourceFilters } from '@ruby/resources/shared';
import { queryClient } from '@ruby/shared/QueryClient';
import { Toast } from '../common/components/toast';
import type { Fetcher } from './Fetcher';
import { Socket, type SocketResponseType } from './Socket';
import type { ResponseType, ResumeChatResponseType, ResumeType } from './types';

/**
 * Get WebSocket URL based on current browser location
 */
function getWsUrl(): string {
  if (typeof window === 'undefined') {
    return 'ws://localhost:3000';
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}`;
}

export class ResumeFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly resumes = {
    retrieve: async (payload: { userId: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/resumes/${payload.userId}`);
    },
    filter: async (payload: {
      filters: ResourceFilters;
      userId: string;
    }): Promise<ResponseType<{ resumes: ResumeType[] }>> => {
      const params = new URLSearchParams(
        Object.entries(payload.filters).map(([k, v]) => [k, String(v)]),
      );
      return this.fetcher.get(
        `/api/resumes/${payload.userId}/filter?${params.toString()}`,
      );
    },

    delete: async (payload: {
      resumeIds: string[];
      userId: string;
    }): Promise<ResponseType> => {
      return this.fetcher.delete('/api/resumes/delete', payload);
    },
    get: async (payload: { id: string }): Promise<ResponseType> => {
      return this.fetcher.get(`/api/resumes/single/${payload.id}`);
    },
    getSuggestions: async (payload: { id: string }): Promise<ResponseType> => {
      const res = this.fetcher.get(`/api/suggestions/resume/${payload.id}`);
      return res;
    },
    rename: async (payload: {
      id: string;
      newName: string;
    }): Promise<ResponseType> => {
      return this.fetcher.patch(`/api/resume/${payload.id}/rename`, {
        newName: payload.newName,
      });
    },
  };

  public readonly create = (payload: { url: string }) => {
    const socket = new Socket(getWsUrl());

    socket.on<{ resume: ResumeType }>('message', (response) => {
      queryClient.invalidateQueries();

      const isReady = response.data.resume.isReady;
      const isFailed = response.data.resume.state === 'failed';

      if (isReady || isFailed) {
        socket.close();
      }

      if (isReady) {
        Toast.success({ description: 'Resume uploaded sucessfully' });
      }

      socket.send({
        channelName: 'resume:create',
        data: {
          url: payload.url,
        },
      });
    });

    Toast.info({ description: 'Uploading resume' });
  };

  public readonly chat = (payload: {
    resumeId: string;
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
      channelName: 'resume:chat',
      data: {
        resumeId: payload.resumeId,
        query: payload.query,
      },
    });
    return socket;
  };
}
