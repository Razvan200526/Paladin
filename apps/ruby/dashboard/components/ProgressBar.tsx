interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  color?: string;
  className?: string;
  suffix?: string;
}

export const ProgressBar = ({
  label,
  current,
  target,
  color = 'bg-primary-400',
  className,
  suffix = '',
}: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex justify-between text-sm">
        <span className="text-secondary-text font-medium">{label}</span>
        <span className="font-semibold text-primary">
          {current}
          {suffix}/{target}
          {suffix}
        </span>
      </div>
      <div className="w-full bg-primary-50 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
