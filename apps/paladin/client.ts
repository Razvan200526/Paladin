/**
 * API Client Utilities
 * Full implementation matching easyres pattern
 */
import { CONTAINER_KEYS, inject } from '@razvan11/paladin';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { ResponseType } from './sdk/types';

type PartialResponse<T> = {
  data: T;
  message?: string | null;
  success?: boolean;
  status?: number;
  isClientError?: boolean;
  isServerError?: boolean;
  isNotFound?: boolean;
  isUnauthorized?: boolean;
  isForbidden?: boolean;
  debug?: boolean;
};

export function apiResponse<T, S extends ContentfulStatusCode = 200>(
  c: Context,
  response: PartialResponse<T>,
  status: S = 200 as S,
): Response & { _data: ResponseType<T> } {
  const fullResponse: ResponseType<T> = {
    data: response.data,
    message: response.message ?? null,
    success: response.success ?? status < 400,
    status,
    isClientError: response.isClientError ?? (status >= 400 && status < 500),
    isServerError: response.isServerError ?? status >= 500,
    isNotFound: response.isNotFound ?? status === 404,
    isUnauthorized: response.isUnauthorized ?? status === 401,
    isForbidden: response.isForbidden ?? status === 403,
    debug: response.debug ?? false,
    app: {
      url: process.env.APP_URL || '',
    },
  };

  return c.json(fullResponse, status) as unknown as Response & {
    _data: ResponseType<T>;
  };
}
