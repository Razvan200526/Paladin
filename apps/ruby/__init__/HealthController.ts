/**
 * Example Health Controller
 * Demonstrates a simple controller without dependencies
 */
import { controller, get } from '@razvan11/paladin';
import type { Context } from 'hono';

@controller('/health')
export class HealthController {
  @get('/')
  check(c: Context) {
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }

  @get('/ready')
  ready(c: Context) {
    return c.json({
      ready: true,
      uptime: process.uptime(),
    });
  }
}
