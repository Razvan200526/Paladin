import { Button } from '@common/components/button';
import { InputChat } from '@common/components/input/InputChat';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { ThinkingIcon } from '@common/icons/ThinkingIcon';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn, ScrollShadow } from '@heroui/react';
import { type ChatMessage, useAiChat } from '@ruby/ask/useAiChat';
import { useAuth } from '@ruby/shared/hooks';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiQuickChatProps {
  onClose: () => void;
}

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <div className="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          <AiChatIcon className="size-3.5 text-light" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-3.5 py-2.5',
          isUser ? 'bg-primary text-light' : 'bg-primary-50 text-primary',
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-base font-bold text-primary mt-3 mb-2 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-bold text-primary mt-3 mb-1.5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-primary mt-2 mb-1 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-primary leading-relaxed mb-2 last:mb-0">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-primary">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-primary">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-4 mb-2 space-y-1 text-sm text-primary">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-4 mb-2 space-y-1 text-sm text-primary">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm leading-relaxed text-primary">
                    {children}
                  </li>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-primary/10 p-2 rounded-lg text-xs font-mono text-primary overflow-x-auto my-2">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-primary/10 p-3 rounded-lg overflow-x-auto my-2">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary/30 pl-3 my-2 italic text-primary/80">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-3 border-primary/20" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full text-sm border border-primary/20 rounded">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-2 py-1 bg-primary/10 text-left font-semibold text-primary border-b border-primary/20">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-2 py-1 text-primary border-b border-primary/10">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const quickSuggestions = [
  { text: 'How to improve my resume?', icon: ResumeIcon },
  { text: 'Cover letter tips', icon: CoverLetterIcon },
  { text: 'Interview preparation', icon: JobIcon },
];

export const AiQuickChat = ({ onClose }: AiQuickChatProps) => {
  const { data: user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, isConnected, isStreaming, sendMessage, newChat } =
    useAiChat({
      userId: user?.id,
      enabled: !!user?.id,
      onError: (error) => {
        Toast.error({ description: error });
      },
    });

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    if (!isConnected) {
      Toast.error({ description: 'Not connected to AI. Please wait...' });
      return;
    }

    sendMessage(message);
    setInputValue('');
  };

  const handleStop = () => {
    newChat();
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 w-full sm:w-95 md:w-105 lg:w-120 z-50 flex flex-col rounded bg-background border border-border transition-transform duration-200 ease-out',
        isClosing
          ? 'translate-x-full'
          : 'translate-x-0 animate-[slideInFromRight_0.2s_ease-out]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center">
            <AiChatIcon className="size-4 text-light" />
          </div>
          <div className="flex flex-col">
            <H6 className="text-primary leading-tight">AI Assistant</H6>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-amber-500 animate-pulse',
                )}
              />
              <span className="text-[10px] text-secondary-text font-semibold">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasMessages && (
            <Button
              variant="light"
              size="sm"
              onPress={newChat}
              className="rounded-full text-xs"
              isDisabled={isStreaming}
            >
              New Chat
            </Button>
          )}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="size-4 text-secondary-text" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col px-4 py-6">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="size-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <AiChatIcon className="size-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-primary mb-1">
                How can I help you?
              </h2>
              <p className="text-xs text-secondary-text text-center max-w-52 font-medium">
                Ask about resumes, cover letters, or job search strategies
              </p>
            </div>

            {/* Quick suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-secondary-text font-semibold uppercase tracking-wide px-1">
                Suggestions
              </span>
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => handleSend(suggestion.text)}
                  disabled={!isConnected}
                  className={cn(
                    'group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-light border border-border transition-colors',
                    isConnected
                      ? 'hover:border-primary-300 hover:bg-primary-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <suggestion.icon className="size-4 text-secondary-text group-hover:text-primary transition-colors" />
                  <span className="text-sm text-primary font-semibold">
                    {suggestion.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <ScrollShadow
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming &&
                messages.length > 0 &&
                !messages[messages.length - 1]?.isStreaming && (
                  <div className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <AiChatIcon className="size-3.5 text-light" />
                    </div>
                    <div className="bg-primary-50 rounded-xl px-3.5 py-2.5">
                      <ThinkingIcon className="size-5 text-primary" />
                    </div>
                  </div>
                )}
            </div>
          </ScrollShadow>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background p-3">
        <InputChat
          placeholder={
            isConnected ? 'Message AI Assistant...' : 'Connecting...'
          }
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          onStop={handleStop}
          isPending={isStreaming || !isConnected}
          showStopButton={isStreaming}
        />
        <p className="text-center text-[10px] text-secondary-text/50 mt-2 font-medium">
          AI can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};
