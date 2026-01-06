import type { Context } from 'hono';
import type { FC } from 'react';
import { renderToString } from 'react-dom/server';

/**
 * Render a React component to an HTML response.
 * This is a production-safe replacement for @razvan11/paladin's render function
 * that uses the standard JSX runtime instead of jsx-dev-runtime.
 */
export function render<P extends Record<string, unknown>>(
  c: Context,
  Component: FC<P>,
  props?: P,
): Response {
  const element = props ? (
    <Component {...props} />
  ) : (
    <Component {...({} as P)} />
  );
  const html = renderToString(element);

  return c.html(`<!DOCTYPE html>${html}`);
}
