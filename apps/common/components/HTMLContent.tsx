import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { H1, H2, H3 } from './typography';

export const HTMLContent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <H1 className="text-xs font-semibold text-primary mt-4 mb-2">
            {children}
          </H1>
        ),
        h2: ({ children }) => (
          <H2 className="text-xs font-semibold text-primary mt-3 mb-2">
            {children}
          </H2>
        ),
        h3: ({ children }) => (
          <H3 className="text-xs text-primary font-semibold mt-2 mb-1">
            {children}
          </H3>
        ),
        p: ({ children }) => (
          <p className="text-xs mb-2 text-secondary-text leading-relaxed">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="text-xs text-secondary-text">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-5 mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-5 mb-2 space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ children }) => (
          <code className="bg-secondary/10 px-1.5 py-0.5 rounded text-sm">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
