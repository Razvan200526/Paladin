import type { Fetcher } from './Fetcher';
import type {
  ResponseType,
  UserAccountType,
  UserSessionType,
  UserType,
  UserTypeType,
  UserVerificationType,
} from './types';

export class UserFetcher {
  constructor(private readonly fetcher: Fetcher) {}

  public readonly exists = async (
    email: string,
  ): Promise<ResponseType<{ exists: boolean }>> => {
    return await this.fetcher.get(`/user-exists?email=${email}`);
  };

  public readonly create = async (payload: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    picture?: string;
    isEmailVerified?: boolean;
  }): Promise<ResponseType<UserType>> => {
    return await this.fetcher.post('/users', payload);
  };

  public readonly filter = async (queries?: {
    page?: number;
    limit?: number;
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    q?: string;
    sortBy?: 'email' | 'name' | 'firstName' | 'lastName' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<
    ResponseType<{
      users: UserType[];
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    }>
  > => {
    const searchParams = new URLSearchParams();
    if (queries) {
      Object.entries(queries).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return await this.fetcher.get(`/users?${searchParams.toString()}`);
  };

  public readonly retrieve = async (
    id: string,
  ): Promise<ResponseType<UserType>> => {
    return await this.fetcher.get(`/users/${id}`);
  };

  public readonly update = async (
    id: string,
    payload: {
      email?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      image?: string;
      isEmailVerified?: boolean;
    },
  ): Promise<ResponseType<UserType>> => {
    return await this.fetcher.put(`/api/update/users/${id}`, payload);
  };

  public readonly delete = async (id: string): Promise<ResponseType<any>> => {
    return await this.fetcher.delete(`/users/${id}`);
  };

  // User Sessions operations
  public readonly sessions = {
    create: async (payload: {
      userId: string;
      token: string;
      expiresAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }): Promise<ResponseType<UserSessionType>> => {
      return await this.fetcher.post('/user-sessions', payload);
    },

    filter: async (queries?: {
      page?: number;
      limit?: number;
      sortBy?: 'expiresAt' | 'ipAddress' | 'createdAt';
      sortOrder?: 'asc' | 'desc';
      userId?: string;
      token?: string;
      expiresAt?: Date;
      ipAddress?: string;
      userAgent?: string;
    }): Promise<
      ResponseType<{
        sessions: UserSessionType[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
      }>
    > => {
      const searchParams = new URLSearchParams();
      if (queries) {
        Object.entries(queries).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      return await this.fetcher.get(
        `/user-sessions?${searchParams.toString()}`,
      );
    },

    retrieve: async (id: string): Promise<ResponseType<UserSessionType>> => {
      return await this.fetcher.get(`/user-sessions/${id}`);
    },

    update: async (
      id: string,
      payload: {
        token?: string;
        expiresAt?: Date;
        ipAddress?: string;
        userAgent?: string;
      },
    ): Promise<ResponseType<UserSessionType>> => {
      return await this.fetcher.put(`/user-sessions/${id}`, payload);
    },

    delete: async (id: string): Promise<ResponseType<any>> => {
      return await this.fetcher.delete(`/user-sessions/${id}`);
    },
  };

  // User Types operations
  public readonly types = {
    create: async (payload: {
      name: string;
      code: string;
      language: string;
    }): Promise<ResponseType<UserTypeType>> => {
      return await this.fetcher.post('/user-types', payload);
    },

    filter: async (queries?: {
      page?: number;
      limit?: number;
      sortBy?: 'name' | 'code' | 'language';
      sortOrder?: 'asc' | 'desc';
      name?: string;
      code?: string;
      language?: string;
      q?: string;
    }): Promise<
      ResponseType<{
        userTypes: UserTypeType[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
      }>
    > => {
      const searchParams = new URLSearchParams();
      if (queries) {
        Object.entries(queries).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      return await this.fetcher.get(`/user-types?${searchParams.toString()}`);
    },

    retrieve: async (id: string): Promise<ResponseType<UserTypeType>> => {
      return await this.fetcher.get(`/user-types/${id}`);
    },

    update: async (
      id: string,
      payload: {
        name?: string;
        code?: string;
        language?: string;
      },
    ): Promise<ResponseType<UserTypeType>> => {
      return await this.fetcher.put(`/user-types/${id}`, payload);
    },

    delete: async (id: string): Promise<ResponseType<any>> => {
      return await this.fetcher.delete(`/user-types/${id}`);
    },
  };

  // User Accounts operations
  public readonly accounts = {
    create: async (payload: {
      user: string;
      providerId: string;
      password?: string;
      accessToken?: string;
      accessTokenExpiresAt?: Date;
      refreshToken?: string;
      refreshTokenExpiresAt?: Date;
      expiresAt?: Date;
      scope?: string;
      idToken?: string;
    }): Promise<ResponseType<UserAccountType>> => {
      return await this.fetcher.post('/user-accounts', payload);
    },

    filter: async (queries?: {
      page?: number;
      limit?: number;
      sortBy?: 'providerId' | 'createdAt';
      sortOrder?: 'asc' | 'desc';
      user?: string;
      providerId?: string;
    }): Promise<
      ResponseType<{
        userAccounts: UserAccountType[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
      }>
    > => {
      const searchParams = new URLSearchParams();
      if (queries) {
        Object.entries(queries).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      return await this.fetcher.get(
        `/user-accounts?${searchParams.toString()}`,
      );
    },

    retrieve: async (id: string): Promise<ResponseType<UserAccountType>> => {
      return await this.fetcher.get(`/user-accounts/${id}`);
    },

    update: async (
      id: string,
      payload: {
        password?: string;
        accessToken?: string;
        accessTokenExpiresAt?: Date;
        refreshToken?: string;
        refreshTokenExpiresAt?: Date;
        expiresAt?: Date;
        scope?: string;
        idToken?: string;
      },
    ): Promise<ResponseType<UserAccountType>> => {
      return await this.fetcher.put(`/user-accounts/${id}`, payload);
    },

    delete: async (id: string): Promise<ResponseType<any>> => {
      return await this.fetcher.delete(`/user-accounts/${id}`);
    },
  };

  // User Verifications operations
  public readonly verifications = {
    create: async (payload: {
      user: string;
      identifier: string;
      value: string;
      expiresAt: Date;
    }): Promise<ResponseType<UserVerificationType>> => {
      return await this.fetcher.post('/user-verifications', payload);
    },

    filter: async (queries?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      user?: string;
      identifier?: string;
      value?: string;
      expiresAt?: Date;
    }): Promise<
      ResponseType<{
        verifications: UserVerificationType[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
      }>
    > => {
      const searchParams = new URLSearchParams();
      if (queries) {
        Object.entries(queries).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      return await this.fetcher.get(
        `/user-verifications?${searchParams.toString()}`,
      );
    },

    retrieve: async (
      id: string,
    ): Promise<ResponseType<UserVerificationType>> => {
      return await this.fetcher.get(`/user-verifications/${id}`);
    },

    update: async (
      id: string,
      payload: {
        identifier?: string;
        value?: string;
        expiresAt?: Date;
      },
    ): Promise<ResponseType<UserVerificationType>> => {
      return await this.fetcher.put(`/user-verifications/${id}`, payload);
    },

    delete: async (id: string): Promise<ResponseType<any>> => {
      return await this.fetcher.delete(`/user-verifications/${id}`);
    },
  };
}
