import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function renderTemplate(element: ReactElement): string {
  const html = renderToStaticMarkup(element);
  return `<!doctype html>${html}`;
}
