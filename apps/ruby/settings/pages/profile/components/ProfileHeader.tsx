import { Card } from '@common/components/card';
import { H4 } from '@common/components/typography';
import { Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  image?: string;
  profession?: string;
}

export const ProfileHeader = ({
  name,
  email,
  image,
  profession,
}: ProfileHeaderProps) => {
  return (
    <Card className="bg-primary-100 border border-border h-full flex items-center justify-center">
      <div className="flex items-center gap-6 py-2">
        <div className="relative shrink-0">
          <Avatar
            src={image}
            size="lg"
            color="primary"
            isBordered
            className="w-20 h-20 text-xl"
            name={name}
            fallback={<Icon icon="mdi:user" className="size-8" />}
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-success-500 border-2 border-light">
            <Icon icon="heroicons:check" className="size-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <H4 className="text-primary truncate">
            {name || 'User'} - {profession}
          </H4>
          <p className="text-sm text-secondary-text truncate">{email}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Icon
                icon="heroicons:shield-check"
                className="size-3.5 text-primary"
              />
              <span className="text-xs font-medium text-primary">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
