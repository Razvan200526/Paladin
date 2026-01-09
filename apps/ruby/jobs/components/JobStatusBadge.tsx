import type { MatchStatus } from '@sdk/JobFetcher';
import { Chip } from '@heroui/react';

interface JobStatusBadgeProps {
  status: MatchStatus;
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  if (status === 'new' || status === 'viewed') return null;

  const color =
    status === 'saved'
      ? 'warning'
      : status === 'applied'
        ? 'success'
        : 'default';

  return (
    <div className="mt-2">
      <Chip size="sm" color={color} variant="flat">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Chip>
    </div>
  );
};
