import { all, controller } from '@razvan11/paladin';
import type { Context } from 'hono';

const postHogHost = Bun.env.APP_POSTHOG_HOST;

@controller('/t')
export class PostHogProxyController {
  @all('/*')
  async proxyPostHog(c: Context) {
    const url = new URL(c.req.url);
    const path = url.pathname.replace('/t', '') || '/';
    const posthogUrl = `${postHogHost}${path}${url.search}`;

    try {
      const headers = new Headers();
      c.req.raw.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey !== 'host' &&
          lowerKey !== 'connection' &&
          lowerKey !== 'content-length'
        ) {
          headers.set(key, value);
        }
      });

      const response = await fetch(posthogUrl, {
        method: c.req.method,
        headers,
        body:
          c.req.method !== 'GET' && c.req.method !== 'HEAD'
            ? c.req.raw.body
            : undefined,
      });

      const responseHeaders = new Headers();
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey !== 'transfer-encoding' &&
          lowerKey !== 'connection' &&
          lowerKey !== 'keep-alive'
        ) {
          responseHeaders.set(key, value);
        }
      });

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error('PostHog proxy error:', error);
      return c.json({ error: 'Proxy failed' }, 502);
    }
  }
}
