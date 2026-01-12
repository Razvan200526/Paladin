import { Card } from '@common/components/card';
import { Textarea, type TextareaRefType } from '@common/components/Textarea';
import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { RefObject } from 'react';

interface ProfileBioProps {
  ref: RefObject<TextareaRefType | null>;
  bio?: string;
}

export const ProfileBio = ({ bio, ref }: ProfileBioProps) => {
  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon
              icon="heroicons:document-text"
              className="size-5 text-primary"
            />
          </div>
          <div>
            <H6 className="text-primary">About Me</H6>
            <p className="text-xs text-secondary-text">
              Write a short bio to tell others about yourself
            </p>
          </div>
        </div>

        <Divider className="bg-border" />

        <div className="space-y-2">
          <Textarea
            ref={ref}
            placeholder={bio}
            minRows={4}
            maxRows={6}
            inputClassName="text-primary"
            wrapperClassName="border-border"
          />
        </div>
      </div>
    </Card>
  );
};
