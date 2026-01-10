/**
 * Auth Middleware
 * Migrated from Paladin with support for @razvan11/paladin pattern
 */
import type { Context, Next } from 'hono';
import type { AuthService } from '../services/AuthService';

export function createAuthMiddleware(authService: AuthService) {
  return async function authMiddleware(c: Context, next: Next) {
    const session = await authService.getSession(c.req.raw.headers);

    if (session?.user) {
      c.set('userId', session.user.id);
    }

    await next();
  };
}

// This is for backwards compatibility
export async function authMiddleware(_c: Context, next: Next) {
  // Note: This requires AuthService to be available globally
  // Prefer using createAuthMiddleware with DI in controllers
  await next();
}
