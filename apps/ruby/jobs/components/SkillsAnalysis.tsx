import { cn } from '@heroui/react';

interface SkillsAnalysisProps {
  matchedSkills: string[];
  missingSkills: string[];
  className?: string;
}

export const SkillsAnalysis = ({
  matchedSkills,
  missingSkills,
  className,
}: SkillsAnalysisProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Matched Skills */}
      <div>
        <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Matched Skills ({matchedSkills.length})
        </h4>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No matched skills found</p>
        )}
      </div>

      {/* Missing Skills */}
      <div>
        <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Skills to Add ({missingSkills.length})
        </h4>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-600">
            You have all required skills! 🎉
          </p>
        )}
      </div>
    </div>
  );
};
