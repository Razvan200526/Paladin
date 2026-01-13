/**
 * Cache Service
 * Redis-based caching layer using Bun's native Redis client
 */

import { inject, logger, service } from '@razvan11/paladin';
import { RedisClient } from 'bun';

const CACHE_PREFIX = 'paladin:';

@service()
export class CacheService {
  private client: RedisClient | null = null;
  private isConnected = false;

  constructor(@inject('APP_REDIS_URL') private readonly redisUrl: string) {
    this.initializeClient();
  }

  private initializeClient(): void {
    if (!this.redisUrl) {
      logger.warn('[CacheService] REDIS_URL not configured, caching disabled');
      return;
    }

    try {
      this.client = new RedisClient(this.redisUrl);

      this.client.onconnect = () => {
        this.isConnected = true;
        logger.info('[CacheService] Connected to Redis');
      };

      this.client.onclose = (error) => {
        this.isConnected = false;
        if (error) {
          logger.warn(`[CacheService] Redis disconnected: ${error}`);
        } else {
          logger.info('[CacheService] Redis connection closed');
        }
      };
    } catch (error) {
      logger.warn(`[CacheService] Failed to initialize Redis client: ${error}`);
    }
  }

  private getKey(key: string): string {
    return `${CACHE_PREFIX}${key}`;
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;

    try {
      const data = await this.client.get(this.getKey(key));
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.warn(`[CacheService] Get error for ${key}: ${error}`);
      return null;
    }
  }

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;

    try {
      const serialized = JSON.stringify(value);
      const prefixedKey = this.getKey(key);

      await this.client.set(prefixedKey, serialized);

      if (ttlSeconds) {
        await this.client.expire(prefixedKey, ttlSeconds);
      }
    } catch (error) {
      logger.warn(`[CacheService] Set error for ${key}: ${error}`);
    }
  }

  /**
   * Delete a key from cache
   */
  async delete(key: string): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.del(this.getKey(key));
    } catch (error) {
      logger.warn(`[CacheService] Delete error for ${key}: ${error}`);
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      return await this.client.exists(this.getKey(key));
    } catch (error) {
      logger.warn(`[CacheService] Exists error for ${key}: ${error}`);
      return false;
    }
  }

  /**
   * Get multiple values from cache
   */
  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.client) return keys.map(() => null);

    try {
      const results = await Promise.all(
        keys.map((k) => this.client?.get(this.getKey(k))),
      );

      return results.map((data) => {
        if (!data) return null;
        try {
          return JSON.parse(data) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      logger.warn(`[CacheService] GetMany error: ${error}`);
      return keys.map(() => null);
    }
  }

  /**
   * Delete all keys matching a pattern
   * Uses SCAN to avoid blocking
   */
  async deletePattern(pattern: string): Promise<void> {
    if (!this.client) return;

    try {
      const fullPattern = this.getKey(pattern);
      let cursor = 0;

      do {
        const result = await this.client.send('SCAN', [
          cursor.toString(),
          'MATCH',
          fullPattern,
          'COUNT',
          '100',
        ]);

        if (Array.isArray(result) && result.length === 2) {
          cursor = Number.parseInt(result[0] as string, 10);
          const keys = result[1] as string[];

          if (keys.length > 0) {
            await this.client.send('DEL', keys);
          }
        } else {
          break;
        }
      } while (cursor !== 0);
    } catch (error) {
      logger.warn(
        `[CacheService] DeletePattern error for ${pattern}: ${error}`,
      );
    }
  }

  /**
   * Check if Redis connection is healthy
   */
  async isHealthy(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  /**
   * Get TTL of a key in seconds (-1 if no TTL, -2 if key doesn't exist)
   */
  async getTTL(key: string): Promise<number> {
    if (!this.client) return -2;

    try {
      return await this.client.ttl(this.getKey(key));
    } catch (error) {
      logger.warn(`[CacheService] TTL error for ${key}: ${error}`);
      return -2;
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(key: string, by = 1): Promise<number | null> {
    if (!this.client) return null;

    try {
      if (by === 1) {
        return await this.client.incr(this.getKey(key));
      }
      const result = await this.client.send('INCRBY', [
        this.getKey(key),
        by.toString(),
      ]);
      return Number(result);
    } catch (error) {
      logger.warn(`[CacheService] Increment error for ${key}: ${error}`);
      return null;
    }
  }

  /**
   * Close the Redis connection
   */
  close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.client?.connected ?? false;
  }
}
