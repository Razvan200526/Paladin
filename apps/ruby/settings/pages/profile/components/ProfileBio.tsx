import { Card } from '@common/components/card';
import { Textarea } from '@common/components/Textarea';
import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface ProfileBioProps {
  bio?: string;
  onBioChange?: (bio: string) => void;
}

export const ProfileBio = ({ bio, onBioChange }: ProfileBioProps) => {
  const [value, setValue] = useState(bio || '');
  const maxLength = 500;

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onBioChange?.(newValue);
  };

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
            value={value}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself, your experience, and what you're looking for..."
            minRows={4}
            maxRows={6}
            inputClassName="text-primary"
            wrapperClassName="border-border"
          />
          <div className="flex justify-end">
            <span className="text-xs text-secondary-text">
              {value.length}/{maxLength} characters
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
