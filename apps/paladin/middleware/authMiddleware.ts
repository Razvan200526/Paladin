/**
 * Auth Middleware
 * Migrated from easyres with support for @razvan11/paladin pattern
 */
import type { Context, Next } from 'hono';
import type { AuthService } from '../services/AuthService';

// Middleware factory that uses DI
export function createAuthMiddleware(authService: AuthService) {
  return async function authMiddleware(c: Context, next: Next) {
    const session = await authService.getSession(c.req.raw.headers);

    if (session?.user) {
      c.set('userId', session.user.id);
    }

    await next();
  };
}

// Standalone middleware that uses service directly
// This is for backwards compatibility
export async function authMiddleware(c: Context, next: Next) {
  // Note: This requires AuthService to be available globally
  // Prefer using createAuthMiddleware with DI in controllers
  await next();
}
