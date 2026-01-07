import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export class MessageFetcher {
  constructor(readonly fetcher: Fetcher) {}

  public readonly coverletter = {
    message: async (payload: {
      question: string;
      id: string;
    }): Promise<ResponseType> => {
      return this.fetcher.post(`/api/coverletters/message/${payload.id}`, {
        message: payload.question,
      });
    },
  };

  public readonly resume = {
    message: async (payload: {
      question: string;
      id: string;
    }): Promise<ResponseType> => {
      return this.fetcher.post(`/api/resumes/message/${payload.id}`, {
        message: payload.question,
      });
    },
  };
}
