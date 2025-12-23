import { H3 } from '@common/components/typography';
import { AlignLeft } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface SummarySectionProps {
  summary?: string;
  onChange: (summary: string) => void;
}

export const SummarySection = ({
  summary = '',
  onChange,
}: SummarySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold text-foreground">
          Professional Summary
        </H3>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlignLeft className="size-4" />
        <p>
          Write a brief 2-4 sentence summary highlighting your key
          qualifications, experience, and career goals.
        </p>
      </div>

      <RichTextEditor
        content={summary}
        placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications..."
        onChange={onChange}
        minHeight="150px"
      />

      <div className="text-xs text-muted-foreground border border-border rounded-lg p-3 bg-muted/30">
        <p className="font-medium mb-1">Tips for a great summary:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-1">
          <li>Start with your job title and years of experience</li>
          <li>Highlight 2-3 key skills or achievements</li>
          <li>Mention what you're looking for in your next role</li>
          <li>Keep it concise - 3-4 sentences max</li>
        </ul>
      </div>
    </div>
  );
};
