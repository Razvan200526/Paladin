import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

interface UserInformationProps {
  user: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    createdAt?: Date | string;
    isEmailVerified?: boolean;
  };
  compact?: boolean;
}

export const UserInformation = ({
  user,
  compact = false,
}: UserInformationProps) => {
  const displayName =
    user.name ||
    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
    'User';

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar
          src={user.image}
          size="md"
          color="primary"
          isBordered
          name={displayName}
          fallback={<Icon icon="mdi:user" className="size-5" />}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-primary truncate">{displayName}</p>
          <p className="text-sm text-secondary-text truncate">{user.email}</p>
        </div>
        {user.isEmailVerified && (
          <div className="shrink-0 px-2 py-0.5 bg-success-100 text-success-700 rounded-full text-xs font-medium">
            Verified
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon icon="heroicons:user" className="size-5 text-primary" />
          </div>
          <div>
            <H6 className="text-primary">User Information</H6>
            <p className="text-xs text-secondary-text">
              Your account details at a glance
            </p>
          </div>
        </div>

        <Divider className="bg-border" />

        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar
              src={user.image}
              size="lg"
              color="primary"
              isBordered
              className="w-16 h-16 text-xl"
              name={displayName}
              fallback={<Icon icon="mdi:user" className="size-6" />}
            />
            {user.isEmailVerified && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-success-500 border-2 border-light">
                <Icon icon="heroicons:check" className="size-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-semibold text-primary text-lg truncate">
              {displayName}
            </p>
            <p className="text-sm text-secondary-text truncate">{user.email}</p>

            <div className="flex items-center gap-3 mt-2">
              {user.isEmailVerified && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-100 border border-success-200">
                  <Icon
                    icon="heroicons:shield-check"
                    className="size-3 text-success-600"
                  />
                  <span className="text-xs font-medium text-success-700">
                    Verified
                  </span>
                </div>
              )}

              {memberSince && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  <Icon
                    icon="heroicons:calendar"
                    className="size-3 text-primary"
                  />
                  <span className="text-xs font-medium text-primary">
                    Since {memberSince}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
