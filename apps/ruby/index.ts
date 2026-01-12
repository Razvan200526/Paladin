import 'reflect-metadata';
import { EnvValidator } from '@common/EnvValidator';
import { controllers } from '@paladin/controllers/controllers';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { DocumentChatHandler } from '@paladin/handlers/DocumentChatHandler';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';
import {
  createRateLimiter,
  RateLimitConfigs,
} from '@paladin/middleware/rateLimitMiddleware';
import { CacheService } from '@paladin/services/CacheService';
import { App, logger } from '@razvan11/paladin';
import { HealthController } from './__init__/HealthController';
import { IndexController } from './__init__/IndexController';

try {
  const app = new App({
    name: 'Paladin',
    cors: [Bun.env.APP_URL || 'http://localhost:8000'],
    validators: { env: [EnvValidator] },
  });

  const hono = app.getAppInstance();

  // const container = (globalThis as any).container;
  // const cache = container.get(CacheService);
  // hono.use('/api/auth/*', createRateLimiter(cache, RateLimitConfigs.auth));
  // hono.use('/api/ai/*', createRateLimiter(cache, RateLimitConfigs.aiChat));
  // hono.use('/ws/ai-chat', createRateLimiter(cache, RateLimitConfigs.aiChat));
  // hono.use(
  //   '/api/jobs/fetch-external',
  //   createRateLimiter(cache, RateLimitConfigs.jobFetch),
  // );
  // hono.use(
  //   '/api/users/avatar/upload',
  //   createRateLimiter(cache, RateLimitConfigs.upload),
  // );
  // // General API rate limiting (less restrictive)
  // hono.use('/api/*', createRateLimiter(cache, RateLimitConfigs.api));

  app.serveStatic({ path: '/static', root: './apps/ruby/shared/public' });
  app.registerControllers(HealthController, ...controllers, IndexController);
  app.registerWebSockets(
    NotificationHandler,
    AiChatHandler,
    DocumentChatHandler,
  );

  await app.run();
} catch (e) {
  logger.error(e as Error);
}
