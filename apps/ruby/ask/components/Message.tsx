import { Avatar, cn } from '@heroui/react';
import type { ChatMessage } from '../useAiChat';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { ThinkingIcon } from '@common/icons/ThinkingIcon';
import ReactMarkdown from 'react-markdown';
import { H1, H2, H3 } from '@common/components/typography';
import remarkGfm from 'remark-gfm';

export const Message = ({
  message,
  userImage,
}: {
  message: ChatMessage;
  userImage?: string;
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : '')}>
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar src={userImage} size="sm" className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <AiChatIcon className="size-4 text-primary" />
          </div>
        )}
      </div>
      <div
        className={cn(
          isUser
            ? 'w-fit rounded-2xl bg-primary/5 text-primary text-sm px-4 py-3 max-w-[80%]'
            : 'flex-1 bg-secondary/5 p-4 rounded-xl prose prose-sm dark:prose-invert max-w-none',
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <>
            {message.isStreaming && !message.content ? (
              <ThinkingIcon className="size-5 text-secondary-text" />
            ) : (
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <H1 className="text-xl font-semibold text-primary mt-4 mb-2">
                        {children}
                      </H1>
                    ),
                    h2: ({ children }) => (
                      <H2 className="text-lg font-semibold text-primary mt-3 mb-2">
                        {children}
                      </H2>
                    ),
                    h3: ({ children }) => (
                      <H3 className="text-base text-primary font-semibold mt-2 mb-1">
                        {children}
                      </H3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 text-secondary-text leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-primary">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-5 mb-2 space-y-1 text-secondary-text">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-5 mb-2 space-y-1 text-secondary-text">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed text-secondary-text">
                        {children}
                      </li>
                    ),
                    code: ({ children }) => (
                      <code className="bg-primary/5 px-1.5 py-0.5 rounded text-sm text-primary">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-primary/5 p-3 rounded-lg overflow-x-auto my-2">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-secondary-text/80 my-2">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-primary underline hover:text-primary/80"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            {message.isStreaming && message.content && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/40 animate-pulse rounded-sm" />
            )}
          </>
        )}
      </div>
    </div>
  );
};
