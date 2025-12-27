import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export class UploadFetcher {
  constructor(readonly fetcher: Fetcher) { }

  public readonly image = {
    avatar: async (data: FormData): Promise<ResponseType<{ url: string }>> => {
      this.fetcher.clearContentType();
      const response = await this.fetcher.post('/uploads/images/avatars', data);
      this.fetcher.setContentType();

      return response;
    },

    image: async (data: FormData): Promise<ResponseType<{ url: string }>> => {
      this.fetcher.clearContentType();
      const response = await this.fetcher.post('/uploads/images', data);
      this.fetcher.setContentType();

      return response;
    },
  };

  public readonly resume = {
    uploadResume: async (
      data: FormData,
    ): Promise<ResponseType<{ url: string }>> => {
      this.fetcher.clearContentType();
      const response = await this.fetcher.post('/resumes/upload', data);
      this.fetcher.setContentType();

      return response;
    },
  };

  public readonly coverLetter = {
    upload: async (data: FormData): Promise<ResponseType<{ url: string }>> => {
      this.fetcher.clearContentType();
      const response = await this.fetcher.post('/coverletters/upload', data);
      this.fetcher.setContentType();

      return response;
    },
  };
}
