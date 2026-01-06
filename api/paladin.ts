// api/paladin.ts
import 'reflect-metadata';
import { App, container, CONTAINER_KEYS } from '@razvan11/paladin';
import { controllers } from '@paladin/controllers/controllers';
import { NotificationHandler } from '@paladin/handlers/NotificationHandler';
import { AiChatHandler } from '@paladin/handlers/AiChatHandler';
import { EnvValidator } from '@common/EnvValidator';

(globalThis as any).Bun = { env: process.env };

container.bind(CONTAINER_KEYS.APP_IS_PRODUCTION).toConstantValue(true);

const app = new App({
  name: 'paladin',
  cors: [process.env.APP_URL || 'http://localhost:3000'],
  validators: { env: [EnvValidator] },
});

app.serveStatic({ path: '/static', root: './apps/ruby/shared/public' });
app.registerControllers(...controllers);
app.registerWebSockets(NotificationHandler, AiChatHandler);

const hono = app.getAppInstance();

export const config = { runtime: 'nodejs' };

export default async function handler(req: any, res: any) {
  const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = `${protocol}://${host}${req.url}`;

  const request = new Request(url, {
    method: req.method,
    headers: req.headers as any,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
  });

  const response = await hono.fetch(request as any);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = await response.arrayBuffer();
  res.end(Buffer.from(body));
}
