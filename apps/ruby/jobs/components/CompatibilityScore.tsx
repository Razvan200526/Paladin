import { cn } from '@heroui/react';

interface CompatibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CompatibilityScore = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}: CompatibilityScoreProps) => {
  const roundedScore = Math.round(score);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg',
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold',
          sizeClasses[size],
          getScoreColor(roundedScore),
        )}
      >
        {roundedScore}%
      </div>
      {showLabel && (
        <span className={cn('text-xs text-muted', size === 'lg' && 'text-sm')}>
          {getScoreLabel(roundedScore)}
        </span>
      )}
    </div>
  );
};
