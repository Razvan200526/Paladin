/**
 * Rate Limiting Middleware
 * Redis-based distributed rate limiting for API endpoints
 */

import { CacheService } from '@paladin/services/CacheService';
import { inject } from '@razvan11/paladin';
import type { Context, Next } from 'hono';

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
  /** Key prefix for rate limit counters */
  keyPrefix?: string;
}

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Create a rate limiting middleware function
 */
export function createRateLimiter(
  cache: CacheService,
  config: RateLimitConfig,
) {
  const { limit, windowSeconds, keyPrefix = 'ratelimit' } = config;

  return async function rateLimiter(
    c: Context,
    next: Next,
  ): Promise<Response | undefined> {
    const userId = c.get('userId');
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0] ||
      c.req.header('x-real-ip') ||
      'unknown';

    const identifier = userId || ip;
    const key = `${keyPrefix}:${identifier}`;

    try {
      const result = await checkRateLimit(cache, key, limit, windowSeconds);

      // Set rate limit headers
      c.res.headers.set('X-RateLimit-Limit', limit.toString());
      c.res.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      c.res.headers.set('X-RateLimit-Reset', result.resetIn.toString());

      if (result.limited) {
        return c.json(
          {
            data: null,
            message: 'Too many requests. Please try again later.',
            isRateLimited: true,
          },
          429,
        );
      }

      await next();
    } catch (_error) {
      await next();
    }
  };
}

/**
 * Check and update rate limit for a key
 */
async function checkRateLimit(
  cache: CacheService,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const count = await cache.increment(key);

  if (count === null) {
    return { limited: false, remaining: limit, resetIn: windowSeconds };
  }

  if (count === 1) {
    await cache.set(key, count, windowSeconds);
  }

  const remaining = Math.max(0, limit - count);
  const ttl = await cache.getTTL(key);
  const resetIn = ttl > 0 ? ttl : windowSeconds;

  return {
    limited: count > limit,
    remaining,
    resetIn,
  };
}

/**
 * Pre-configured rate limiters for different endpoint types
 */
export const RateLimitConfigs = {
  /** Auth endpoints: 5 requests per minute */
  auth: { limit: 5, windowSeconds: 60, keyPrefix: 'ratelimit:auth' },

  /** AI chat endpoints: 20 requests per minute */
  aiChat: { limit: 20, windowSeconds: 60, keyPrefix: 'ratelimit:ai' },

  /** Standard API endpoints: 100 requests per minute */
  api: { limit: 100, windowSeconds: 60, keyPrefix: 'ratelimit:api' },

  /** File upload endpoints: 10 requests per minute */
  upload: { limit: 10, windowSeconds: 60, keyPrefix: 'ratelimit:upload' },

  /** External job fetch: 5 requests per 5 minutes */
  jobFetch: { limit: 5, windowSeconds: 300, keyPrefix: 'ratelimit:jobfetch' },
} as const;

/**
 * RateLimitService - Injectable service for rate limiting
 */
export class RateLimitService {
  constructor(@inject(CacheService) private cache: CacheService) {}

  /**
   * Check if a request should be rate limited
   */
  async checkLimit(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    const key = `${config.keyPrefix || 'ratelimit'}:${identifier}`;
    return checkRateLimit(this.cache, key, config.limit, config.windowSeconds);
  }

  /**
   * Create a middleware for a specific config
   */
  createMiddleware(config: RateLimitConfig) {
    return createRateLimiter(this.cache, config);
  }
}
