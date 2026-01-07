import { Button } from '@common/components/button/Button';
import { H6 } from '@common/components/typography';
import { cn, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { SparklesIcon } from 'lucide-react';
import { useState } from 'react';

export type AIAssistType =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'project'
  | 'improve';

interface AIAssistButtonProps {
  type: AIAssistType;
  onGenerate: () => void;
  onImprove?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  hasContent?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const AI_ASSIST_CONFIG: Record<
  AIAssistType,
  {
    generateLabel: string;
    improveLabel: string;
    description: string;
  }
> = {
  summary: {
    generateLabel: 'Generate Summary',
    improveLabel: 'Improve Summary',
    description: 'Let AI help you write a professional summary',
  },
  experience: {
    generateLabel: 'Generate Bullets',
    improveLabel: 'Improve Content',
    description: 'Generate impactful bullet points for your experience',
  },
  skills: {
    generateLabel: 'Suggest Skills',
    improveLabel: 'Add More Skills',
    description: 'Get AI-powered skill suggestions based on your role',
  },
  project: {
    generateLabel: 'Generate Description',
    improveLabel: 'Improve Description',
    description: 'Create a compelling project description',
  },
  improve: {
    generateLabel: 'Improve Content',
    improveLabel: 'Improve More',
    description: 'Enhance your content with AI suggestions',
  },
};

export const AIAssistButton = ({
  type,
  onGenerate,
  onImprove,
  isLoading = false,
  disabled = false,
  hasContent = false,
  className,
  size = 'sm',
}: AIAssistButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = AI_ASSIST_CONFIG[type];

  const handleGenerate = () => {
    setIsOpen(false);
    onGenerate();
  };

  const handleImprove = () => {
    setIsOpen(false);
    onImprove?.();
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <PopoverTrigger>
        <Button
          variant="flat"
          color="secondary"
          size={size}
          isIconOnly={size === 'sm'}
          disabled={disabled || isLoading}
          isLoading={isLoading}
          className={cn('gap-1.5', isLoading && 'animate-pulse', className)}
          startContent={
            !isLoading && <SparklesIcon className="size-3.5 text-violet-500" />
          }
        >
          {size === 'md' && 'AI Assist'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-64">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-violet-500" />
            <H6 className="font-semibold">AI Assistant</H6>
          </div>
          <p className="text-xs text-secondary-text">{config.description}</p>
          <div className="flex flex-col gap-2">
            {!hasContent && (
              <Button
                variant="flat"
                color="primary"
                size="sm"
                onClick={handleGenerate}
                startContent={<SparklesIcon className="size-3.5" />}
                className="w-full justify-start"
              >
                {config.generateLabel}
              </Button>
            )}
            {hasContent && (
              <>
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onClick={handleGenerate}
                  startContent={<SparklesIcon className="size-3.5" />}
                  className="w-full justify-start"
                >
                  {config.generateLabel}
                </Button>
                {onImprove && (
                  <Button
                    variant="light"
                    color="secondary"
                    size="sm"
                    onClick={handleImprove}
                    startContent={<SparklesIcon className="size-3.5" />}
                    className="w-full justify-start"
                  >
                    {config.improveLabel}
                  </Button>
                )}
              </>
            )}
          </div>
          <p className="text-[10px] text-secondary-text/70 text-center">
            Powered by AI • Results may need review
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Simplified inline button for tight spaces
export const AIAssistInlineButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'AI Assist',
  className,
}: {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium',
        'text-violet-600 hover:text-violet-700 hover:bg-violet-50',
        'rounded-md transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isLoading && 'animate-pulse',
        className,
      )}
    >
      <SparklesIcon className="size-3" />
      {isLoading ? 'Generating...' : label}
    </button>
  );
};
