import type { ReactNode } from 'react';

export interface LayoutViewProps {
  favicon?: string;
  title?: string;
  description?: string;
  styles?: string[];
  scripts?: string[];
  clientData?: Record<string, unknown>;
  className?: string;
  children?: ReactNode;
}

/**
 * A production-safe LayoutView component that replaces @razvan11/paladin's LayoutView.
 * This uses the standard JSX runtime instead of jsx-dev-runtime.
 */
export const LayoutView = ({
  favicon,
  title = 'App',
  description,
  styles = [],
  scripts = [],
  clientData,
  className,
  children,
}: LayoutViewProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {favicon && <link rel="icon" href={favicon} />}
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {styles.map((href, i) => (
          <link key={i} rel="stylesheet" href={href} />
        ))}
        {clientData && (
          <script
            id="__CLIENT_DATA__"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(clientData) }}
          />
        )}
      </head>
      <body className={className}>
        {children}
        {scripts.map((src, i) => (
          <script key={i} src={src} type="module" />
        ))}
      </body>
    </html>
  );
};

/**
 * Helper function to generate asset paths.
 * Replaces @razvan11/paladin's asset function.
 */
export function asset(...paths: string[]): string {
  return `/static/${paths.join('/')}`;
}
