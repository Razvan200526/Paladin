// api/paladin.ts (in your SPA repo that depends on @razvan11/paladin)
import 'reflect-metadata';
import { App, container, CONTAINER_KEYS } from '@razvan11/paladin';
import { controllers } from '@paladin/controllers/controllers';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { EnvValidator } from '@common/EnvValidator';

container.bind(CONTAINER_KEYS.APP_IS_PRODUCTION).toConstantValue(true);

const app = new App({
  name: 'paladin',
  cors: [Bun.env.APP_URL || 'http://localhost:3000'],
  validators: { env: [EnvValidator] },
});

app.serveStatic({ path: '/static', root: './public' }); // optional
app.registerControllers(...controllers);
app.registerWebSockets(NotificationHandler, AiChatHandler);

const hono = app.getAppInstance();

export const config = { runtime: 'nodejs' }; // lets Vercel know to use Bun
export default {
  async fetch(request: Request, server: any) {
    return hono.fetch(request, server);
  },
};
