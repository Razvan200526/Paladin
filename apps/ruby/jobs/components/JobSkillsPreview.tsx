import { Chip } from '@heroui/react';

interface JobSkillsPreviewProps {
  skills: string[];
  maxDisplay?: number;
}

export const JobSkillsPreview = ({
  skills,
  maxDisplay = 4,
}: JobSkillsPreviewProps) => {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {skills.slice(0, maxDisplay).map((skill) => (
        <Chip
          key={skill}
          size="sm"
          variant="flat"
          color="primary"
          className="text-xs border border-border"
        >
          {skill}
        </Chip>
      ))}
      {skills.length > maxDisplay && (
        <Chip color="secondary" size="sm" variant="flat" className="text-xs">
          +{skills.length - maxDisplay} more
        </Chip>
      )}
    </div>
  );
};
