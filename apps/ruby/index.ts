import 'reflect-metadata';
import { EnvValidator } from '@common/EnvValidator';
import { controllers } from '@paladin/controllers/controllers';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { DocumentChatHandler } from '@paladin/handlers/DocumentChatHandler';

import { App, logger } from '@razvan11/paladin';
import { HealthController } from './__init__/HealthController';
import { IndexController } from './__init__/IndexController';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';

try {
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

  await app.run();
} catch (e) {
  logger.error(e as Error);
}
