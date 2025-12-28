import { Button } from '@common/components/button';
import { InputChat } from '@common/components/input/InputChat';
import { H6 } from '@common/components/typography';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { ThinkingIcon } from '@common/icons/ThinkingIcon';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn, ScrollShadow } from '@heroui/react';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AiQuickChatProps {
  onClose: () => void;
}

const MessageBubble = ({ message }: { message: Message }) => {
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
          'max-w-[80%] rounded-xl px-3.5 py-2.5',
          isUser ? 'bg-primary text-light' : 'bg-primary-50 text-primary',
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {message.content}
        </p>
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulated response - replace with actual API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm here to help with your job search! This is a placeholder response. The AI integration will provide personalized advice.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStop = () => {
    setIsLoading(false);
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
            <span className="text-[10px] text-secondary-text font-semibold">
              Powered by Gemini
            </span>
          </div>
        </div>
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

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!hasMessages ? (
          /* Empty State */
          <div className="flex-1 flex flex-col px-4 py-6">
            {/* Welcome */}
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
                  className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-light border border-border hover:border-primary-300 hover:bg-primary-50 transition-colors"
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
          <ScrollShadow className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
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
          placeholder="Message AI Assistant..."
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          onStop={handleStop}
          isPending={isLoading}
          showStopButton={isLoading}
        />
        <p className="text-center text-[10px] text-secondary-text/50 mt-2 font-medium">
          AI can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};
