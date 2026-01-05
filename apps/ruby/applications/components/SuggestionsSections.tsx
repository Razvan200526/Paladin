import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';

export const SuggestionsSections = ({
  application,
}: {
  application: ApplicationType;
}) => {
  return (
    <div>
      {application && application.suggestions?.length > 0 && (
        <>
          <Divider />
          <div>
            <H6 className="text-primary mb-3">Suggestions</H6>
            <div className="space-y-2">
              {application.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
                >
                  <Icon
                    icon="heroicons:light-bulb"
                    className="size-4 text-amber-500 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-secondary-text">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
