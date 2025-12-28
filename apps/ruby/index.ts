/**
 * Full Example Application
 * Demonstrates using the Azurite framework with controllers
 */
import 'reflect-metadata';

import { EnvValidator } from '@common/EnvValidator';
import { controllers } from '@paladin/controllers/controllers';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';
import { App, logger } from '@razvan11/paladin';
import { HealthController } from './__init__/HealthController';
import { IndexController } from './__init__/IndexController';

try {
  const app = new App({
    name: 'example-app',
    cors: ['http://localhost:3000'],
    validators: { env: [EnvValidator] },
  });

  app.serveStatic({ path: '/static', root: './apps/ruby/shared/public' });

  app.registerControllers(HealthController, ...controllers, IndexController);
  app.registerWebSockets(NotificationHandler, AiChatHandler);

  await app.run();
} catch (e) {
  logger.error(e as Error);
}
