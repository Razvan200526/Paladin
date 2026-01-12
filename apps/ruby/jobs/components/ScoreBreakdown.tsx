import { cn } from '@heroui/react';

interface ScoreBreakdownProps {
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  keywordsScore: number;
  semanticScore: number;
  className?: string;
}

interface ScoreBarProps {
  label: string;
  score: number;
}

const ScoreBar = ({ label, score }: ScoreBarProps) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-secondary-text font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">{Math.round(score)}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-primary-400"
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
};

export const ScoreBreakdown = ({
  skillsScore,
  experienceScore,
  educationScore,
  keywordsScore,
  semanticScore,
  className,
}: ScoreBreakdownProps) => {
  const scores = [
    { label: 'Skills Match', score: skillsScore },
    { label: 'Experience', score: experienceScore },
    { label: 'Keywords', score: keywordsScore },
    { label: 'Semantic Relevance', score: semanticScore },
    { label: 'Education', score: educationScore },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="font-semibold text-primary text-sm">Score Breakdown</h4>
      <div className="space-y-3">
        {scores.map((item) => (
          <ScoreBar key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};
