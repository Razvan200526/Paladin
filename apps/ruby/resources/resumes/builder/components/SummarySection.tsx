import { H3 } from '@common/components/typography';
import { AlignLeft, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { useResumeAI } from '../hooks/useResumeAI';
import { AIAssistButton } from './AIAssistButton';
import { RichTextEditor } from './RichTextEditor';

interface SummarySectionProps {
  summary?: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
  yearsOfExperience?: number;
  skills?: string[];
}

export const SummarySection = ({
  summary = '',
  onChange,
  jobTitle = '',
  yearsOfExperience = 0,
  skills = [],
}: SummarySectionProps) => {
  const {
    generateSummary,
    improveContent,
    isGeneratingSummary,
    isImprovingContent,
  } = useResumeAI();
  const [showJobTitlePrompt, setShowJobTitlePrompt] = useState(false);
  const [tempJobTitle, setTempJobTitle] = useState(jobTitle);
  const [tempYears, setTempYears] = useState(yearsOfExperience.toString());

  const hasContent = summary && summary !== '<p></p>' && summary.trim() !== '';
  const isLoading = isGeneratingSummary || isImprovingContent;

  const handleGenerateSummary = async () => {
    if (!tempJobTitle) {
      setShowJobTitlePrompt(true);
      return;
    }

    const result = await generateSummary({
      jobTitle: tempJobTitle || jobTitle || 'Professional',
      yearsOfExperience:
        Number.parseInt(tempYears, 10) || yearsOfExperience || 3,
      skills: skills.length > 0 ? skills : undefined,
    });

    if (result) {
      // Convert plain text to HTML paragraph
      const htmlContent = `<p>${result.replace(/\n/g, '</p><p>')}</p>`;
      onChange(htmlContent);
    }
    setShowJobTitlePrompt(false);
  };

  const handleImproveSummary = async () => {
    if (!hasContent) return;

    const result = await improveContent({
      content: summary,
      type: 'summary',
    });

    if (result?.improved) {
      onChange(result.improved);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold text-foreground">
          Professional Summary
        </H3>
        <AIAssistButton
          type="summary"
          onGenerate={() => {
            if (!jobTitle && !tempJobTitle) {
              setShowJobTitlePrompt(true);
            } else {
              handleGenerateSummary();
            }
          }}
          onImprove={handleImproveSummary}
          isLoading={isLoading}
          hasContent={!!hasContent}
          size="md"
        />
      </div>

      {showJobTitlePrompt && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-violet-700">
            <SparklesIcon className="size-4" />
            <span className="font-medium text-sm">
              Help AI write your summary
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ai-job-title"
                className="text-xs text-secondary-text block mb-1"
              >
                Job Title
              </label>
              <input
                id="ai-job-title"
                type="text"
                value={tempJobTitle}
                onChange={(e) => setTempJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label
                htmlFor="ai-years-exp"
                className="text-xs text-secondary-text block mb-1"
              >
                Years of Experience
              </label>
              <input
                id="ai-years-exp"
                type="number"
                value={tempYears}
                onChange={(e) => setTempYears(e.target.value)}
                placeholder="e.g., 5"
                min="0"
                max="50"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowJobTitlePrompt(false)}
              className="px-3 py-1.5 text-sm text-secondary-text hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={!tempJobTitle || isLoading}
              className="px-4 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <SparklesIcon className="size-3.5" />
              Generate
            </button>
          </div>
        </div>
      )}

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
