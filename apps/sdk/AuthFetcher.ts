import type { Fetcher } from './Fetcher';
import type { ResponseType, UserType } from './types';

export class AuthFetcher {
  constructor(private readonly fetcher: Fetcher) {}

  public setAuthToken(token: string) {
    this.fetcher.setAuthToken(token);
  }
  public readonly signup = {
    email: async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      image: string;
    }): Promise<ResponseType<{ success: boolean; user: UserType }>> => {
      return await this.fetcher.post('/api/auth/signup/email', payload);
    },
    checkOtp: async (payload: {
      email: string;
      otp: string;
    }): Promise<ResponseType<{ error: string; success: boolean }>> => {
      return await this.fetcher.post(
        `/api/auth/signup/check-otp?email=${payload.email}&code=${payload.otp}`,
      );
    },
    sendOTP: async (payload: {
      email: string;
    }): Promise<ResponseType<{ success: boolean }>> => {
      return await this.fetcher.post(
        '/auth/email-otp/send-verification-otp',
        payload,
      );
    },
  };
  public readonly signIn = {
    email: async (payload: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }): Promise<
      | ResponseType<{
          user: UserType;
          token: string;
        }>
      | ResponseType<{ error: string }>
    > => {
      const res = await this.fetcher.post('/auth/signin/email', payload);
      if (res.success) {
        this.fetcher.setAuthToken(res.data.token, 'Bearer');
      }
      return res;
    },
  };

  public readonly forgetPassword = {
    email: async (
      email: string,
    ): Promise<ResponseType<{ success: boolean }>> => {
      return await this.fetcher.post('/auth/forget-password/email', { email });
    },
  };

  public readonly resetPassword = async (payload: {
    email: string;
    otp: string;
    password: string;
  }): Promise<ResponseType<{ success: boolean }>> => {
    return await this.fetcher.post('/auth/reset-password', payload);
  };

  public readonly retrieve = async (): Promise<
    ResponseType<{ user: UserType | null }>
  > => {
    return await this.fetcher.get('/auth/session');
  };

  public async signout(): Promise<ResponseType<{ success: boolean }>> {
    return await this.fetcher.get('/auth/signout');
  }
}
