/**
 * HTTP Caching Headers Utility
 * Utilities for setting proper cache control headers on responses
 */

import type { Context } from 'hono';

interface CacheControlOptions {
  /** Max age in seconds for browser cache */
  maxAge?: number;
  /** Max age in seconds for CDN/proxy cache */
  sMaxAge?: number;
  /** Allow CDN to serve stale content while revalidating */
  staleWhileRevalidate?: number;
  /** Mark as private (user-specific content) */
  private?: boolean;
  /** Mark as public (CDN cacheable) */
  public?: boolean;
  /** Require revalidation before serving cached content */
  mustRevalidate?: boolean;
  /** Don't cache at all */
  noCache?: boolean;
  /** Don't store in any cache */
  noStore?: boolean;
  /** Mark as immutable (won't change) */
  immutable?: boolean;
}

/**
 * Set Cache-Control header on response
 */
export function setCacheControl(c: Context, options: CacheControlOptions): void {
  const directives: string[] = [];

  if (options.noStore) {
    directives.push('no-store');
  } else if (options.noCache) {
    directives.push('no-cache');
  } else {
    if (options.private) {
      directives.push('private');
    } else if (options.public) {
      directives.push('public');
    }

    if (options.maxAge !== undefined) {
      directives.push(`max-age=${options.maxAge}`);
    }

    if (options.sMaxAge !== undefined) {
      directives.push(`s-maxage=${options.sMaxAge}`);
    }

    if (options.staleWhileRevalidate !== undefined) {
      directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }

    if (options.mustRevalidate) {
      directives.push('must-revalidate');
    }

    if (options.immutable) {
      directives.push('immutable');
    }
  }

  if (directives.length > 0) {
    c.res.headers.set('Cache-Control', directives.join(', '));
  }
}

/**
 * Set ETag header for conditional requests
 */
export function setETag(c: Context, value: string): void {
  const etag = value.startsWith('"') ? value : `"${value}"`;
  c.res.headers.set('ETag', etag);
}

/**
 * Check if client has valid cached version (If-None-Match)
 */
export function checkIfNoneMatch(c: Context, currentETag: string): boolean {
  const clientETag = c.req.header('if-none-match');
  if (!clientETag) return false;

  const normalized = currentETag.startsWith('"')
    ? currentETag
    : `"${currentETag}"`;
  return clientETag === normalized || clientETag === `W/${normalized}`;
}

/**
 * Pre-configured cache control settings for common scenarios
 */
export const CachePresets = {
  /** Static assets (1 year, immutable with hash in filename) */
  staticAssets: {
    public: true,
    maxAge: 31536000, // 1 year
    immutable: true,
  } as CacheControlOptions,

  /** API responses that can be cached briefly */
  apiShort: {
    private: true,
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
  } as CacheControlOptions,

  /** API responses with CDN caching */
  apiWithCDN: {
    public: true,
    maxAge: 60, // 1 minute browser
    sMaxAge: 300, // 5 minutes CDN
    staleWhileRevalidate: 600, // 10 minutes
  } as CacheControlOptions,

  /** User-specific data (no CDN) */
  private: {
    private: true,
    maxAge: 0,
    mustRevalidate: true,
  } as CacheControlOptions,

  /** Never cache (sensitive data) */
  noCache: {
    noStore: true,
  } as CacheControlOptions,

  /** Semi-static data (e.g., job listings) */
  semiStatic: {
    public: true,
    maxAge: 300, // 5 minutes
    sMaxAge: 900, // 15 minutes CDN
    staleWhileRevalidate: 3600, // 1 hour
  } as CacheControlOptions,
} as const;
