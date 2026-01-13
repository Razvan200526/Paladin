import 'reflect-metadata';
import { EnvValidator } from '@common/EnvValidator';
import { controllers } from '@paladin/controllers/controllers';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { DocumentChatHandler } from '@paladin/handlers/DocumentChatHandler';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';
import { App, logger } from '@razvan11/paladin';
import { HealthController } from './__init__/HealthController';
import { IndexController } from './__init__/IndexController';

export const createApp = () => {
  const app = new App({
    name: 'Paladin',
    cors: [Bun.env.APP_URL || 'http://localhost:8000'],
    validators: { env: [EnvValidator] },
  });

  app.serveStatic({ path: '/static', root: './apps/ruby/shared/public' });
  app.registerControllers(HealthController, ...controllers, IndexController);
  app.registerWebSockets(
    NotificationHandler,
    AiChatHandler,
    DocumentChatHandler,
  );

  return app;
};

if (import.meta.main) {
  try {
    const app = createApp();
    await app.run();
  } catch (e) {
    logger.error(e as Error);
    process.exit(1);
  }
}
