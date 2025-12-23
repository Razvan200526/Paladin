import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export class ChatFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly sessions = {
    retrieve: async (payload: { userId: string }): Promise<ResponseType> => {
      const res = this.fetcher.get(`/api/chat/sessions/${payload.userId}`);
      return res;
    },

    create: async (payload: {
      resourceType: 'resume' | 'coverletter';
      resourceId: string;
      resourceName: string;
    }): Promise<ResponseType> => {
      const res = this.fetcher.post('/api/chat/sessions', payload);
      return res;
    },

    get: async (payload: { id: string }): Promise<ResponseType> => {
      const res = this.fetcher.get(`/api/chat/sessions/session/${payload.id}`);
      return res;
    },
    getByResource: async (payload: {
      resourceType: 'resume' | 'coverletter';
      resourceId: string;
    }): Promise<ResponseType> => {
      const res = this.fetcher.get(
        `/api/chat/sessions/resource/${payload.resourceType}/${payload.resourceId}`,
      );
      return res;
    },
  };

  public readonly messages = {
    retrieve: async (payload: { sessionId: string }): Promise<ResponseType> => {
      const res = this.fetcher.get(`/api/chat/messages/${payload.sessionId}`);
      return res;
    },

    create: async (payload: {
      sessionId: string;
      content: string;
      sender: 'user' | 'ai';
    }): Promise<ResponseType> => {
      const res = this.fetcher.post('/api/chat/messages', payload);
      return res;
    },

    update: async (payload: {
      sessionId: string;
      messages: Array<{
        content: string;
        sender: 'user' | 'ai';
      }>;
    }): Promise<ResponseType> => {
      const res = this.fetcher.put(`/api/chat/messages/${payload.sessionId}`, {
        messages: payload.messages,
      });
      return res;
    },
  };
}
