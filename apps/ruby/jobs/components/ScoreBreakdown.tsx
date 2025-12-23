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
  weight: string;
}

const ScoreBar = ({ label, score, weight }: ScoreBarProps) => {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-secondary-text">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">({weight})</span>
          <span className="font-medium text-primary">{Math.round(score)}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            getBarColor(score),
          )}
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
    { label: 'Skills Match', score: skillsScore, weight: '35%' },
    { label: 'Experience', score: experienceScore, weight: '20%' },
    { label: 'Keywords', score: keywordsScore, weight: '20%' },
    { label: 'Semantic Relevance', score: semanticScore, weight: '15%' },
    { label: 'Education', score: educationScore, weight: '10%' },
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
