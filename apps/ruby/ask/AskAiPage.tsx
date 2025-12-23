import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { H2 } from '@common/components/typography';
import { AiChatIcon } from '@common/icons/AiChatIcon';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { ThinkingIcon } from '@common/icons/ThinkingIcon';
import { cn, ScrollShadow, Textarea } from '@heroui/react';
import { SendIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestionPillProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  prompt: string;
  onClick: () => void;
}

const SuggestionPill = ({
  icon: Icon,
  title,
  prompt,
  onClick,
}: SuggestionPillProps) => (
  <button
    type="button"
    onClick={onClick}
    title={prompt}
    className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary-200 bg-light hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
  >
    <Icon className="size-4 text-primary" />
    <span className="text-sm font-medium text-primary">{title}</span>
  </button>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-light rounded-br-sm'
            : 'bg-light text-primary border border-primary-100 rounded-bl-sm',
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export const AskAiPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    {
      icon: ResumeIcon,
      title: 'Resume Tips',
      prompt: 'What are the best practices for creating a standout resume?',
    },
    {
      icon: CoverLetterIcon,
      title: 'Cover Letters',
      prompt: 'How do I write a cover letter that gets noticed?',
    },
    {
      icon: JobIcon,
      title: 'Job Search',
      prompt: 'What are the most effective job search strategies in 2025?',
    },
    {
      icon: AiChatIcon,
      title: 'Interview Prep',
      prompt: 'How should I prepare for a job interview?',
    },
  ];

  const handleSend = async (message: string) => {
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
          "I'm here to help you with your job search journey! This is a placeholder response. The actual AI integration will provide personalized advice about resumes, cover letters, and job search strategies.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AiChatIcon className="size-5 text-primary" />
            <H2 className="text-base font-semibold">Ask AI</H2>
          </div>
          <span className="text-xs text-secondary-text font-medium">
            Career Assistant
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!hasMessages ? (
          /* Empty State - Centered input focus */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-xl space-y-6">
              {/* Welcome */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-secondary-text">
                  <SparklesIcon className="size-4" />
                  <span className="text-sm font-medium">Powered by AI</span>
                </div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">
                  What would you like to know?
                </h1>
                <p className="text-sm text-secondary-text">
                  Get personalized advice on resumes, cover letters, and your
                  job search
                </p>
              </div>

              {/* Input Card */}
              <Card className="p-0 border-primary-200">
                <div className="flex items-end gap-2 p-3">
                  <Textarea
                    value={inputValue}
                    onValueChange={setInputValue}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    minRows={2}
                    maxRows={5}
                    classNames={{
                      base: 'flex-1',
                      inputWrapper:
                        'border-none bg-transparent shadow-none data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
                      input:
                        'text-sm text-primary placeholder:text-primary-300 resize-none',
                    }}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    isDisabled={!inputValue.trim() || isLoading}
                    onPress={() => handleSend(inputValue)}
                    className="rounded-lg mb-1"
                  >
                    <SendIcon className="size-4" />
                  </Button>
                </div>
              </Card>

              {/* Suggestion Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <SuggestionPill
                    key={suggestion.title}
                    icon={suggestion.icon}
                    title={suggestion.title}
                    prompt={suggestion.prompt}
                    onClick={() => handleSend(suggestion.prompt)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <>
            <ScrollShadow className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-light border border-primary-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <ThinkingIcon className="size-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollShadow>

            {/* Input Area - when chatting */}
            <div className="border-t border-border bg-background px-6 py-4">
              <div className="max-w-2xl mx-auto">
                <Card className="p-0 border-primary-200">
                  <div className="flex items-end gap-2 p-2">
                    <Textarea
                      value={inputValue}
                      onValueChange={setInputValue}
                      onKeyDown={handleKeyDown}
                      placeholder="Continue the conversation..."
                      minRows={1}
                      maxRows={4}
                      classNames={{
                        base: 'flex-1',
                        inputWrapper:
                          'border-none bg-transparent shadow-none data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
                        input:
                          'text-sm text-primary placeholder:text-primary-300 resize-none',
                      }}
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      isDisabled={!inputValue.trim() || isLoading}
                      onPress={() => handleSend(inputValue)}
                      className="rounded-lg mb-1"
                    >
                      <SendIcon className="size-4" />
                    </Button>
                  </div>
                </Card>
                <p className="text-center text-xs text-secondary-text/70 mt-2">
                  AI responses may not always be accurate
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
