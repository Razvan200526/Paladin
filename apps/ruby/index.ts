/**
 * Full Example Application
 * Demonstrates using the Azurite framework with controllers
 */
import 'reflect-metadata';

container
  .bind(CONTAINER_KEYS.APP_DATABASE_URL)
  .toConstantValue(Bun.env.DATABASE_URL || '');
container
  .bind(CONTAINER_KEYS.APP_NAME)
  .toConstantValue(Bun.env.APP_NAME || 'azurite');
container
  .bind(CONTAINER_KEYS.APP_URL)
  .toConstantValue(Bun.env.APP_URL || 'http://localhost:3000');

import { EnvValidator } from '@common/EnvValidator';
import { App, CONTAINER_KEYS, container, logger } from '@razvan11/paladin';
import { HealthController } from './__init__/HealthController';
import { IndexController } from './__init__/IndexController';

try {
  const app = new App({
    name: 'example-app',
    cors: ['http://localhost:3000'],
    validators: { env: [EnvValidator] },
  });

  app.serveStatic({ path: '/static', root: './apps/ruby/shared/public' });

  app.registerControllers(HealthController, IndexController);

  await app.run();
} catch (e) {
  logger.error(e as Error);
}
