import { H4, H6 } from '@common/components/typography';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';

interface ApplicationCommentsCardProps {
  application: ApplicationType;
}

export const ApplicationCommentsCard = ({
  application,
}: ApplicationCommentsCardProps) => {
  if (
    (!application.comments || application.comments.length === 0) &&
    (!application.suggestions || application.suggestions.length === 0)
  ) {
    return null;
  }

  return (
    <div className="bg-light border border-border rounded-lg p-6">
      <H4 className="mb-4 flex items-center gap-2">
        <Icon icon="heroicons:light-bulb" className="size-5 text-primary" />
        Notes & Suggestions
      </H4>

      {application.comments && application.comments.length > 0 && (
        <div className="mb-4">
          <H6 className="text-sm font-semibold text-muted mb-3">Comments</H6>
          <ul className="space-y-2">
            {application.comments.map((comment, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-background rounded border border-border"
              >
                <Icon
                  icon="heroicons:chat-bubble-left"
                  className="size-4 text-primary mt-0.5 shrink-0"
                />
                <span className="text-sm text-secondary-text">{comment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {application.suggestions && application.suggestions.length > 0 && (
        <div>
          <H6 className="text-sm font-semibold text-muted mb-3">Suggestions</H6>
          <ul className="space-y-2">
            {application.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-secondary-50 rounded border border-secondary-200"
              >
                <Icon
                  icon="heroicons:light-bulb"
                  className="size-4 text-secondary-600 mt-0.5 shrink-0"
                />
                <span className="text-sm text-secondary-text">
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
