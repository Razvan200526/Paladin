import { Button } from '@common/components/button';
import {
  Dropdown,
  type DropdownItemDataType,
} from '@common/components/dropdown/Dropdown';
import { Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@ruby/shared/hooks';
import type { ApplicationType } from '@sdk/types';
import { useState } from 'react';
import { useUpdateApplicationStatus } from '../hooks/applicationHooks';
import { statusConfig } from '../utils/applicationData';
export const dropdownItems: DropdownItemDataType[] = [
  {
    key: 'Applied',
    label: 'Applied',
    startContent: <Icon icon="heroicons:document-text" className="size-4" />,
  },
  {
    key: 'Interviewing',
    label: 'Interviewing',
    startContent: (
      <Icon icon="heroicons:chat-bubble-left-right" className="size-4" />
    ),
  },
  {
    key: 'Accepted',
    label: 'Accepted',
    startContent: <Icon icon="heroicons:check-circle" className="size-4" />,
  },
  {
    key: 'Rejected',
    label: 'Rejected',
    startContent: <Icon icon="heroicons:x-circle" className="size-4" />,
  },
];

type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

export const StatusDropdown = ({
  application,
}: {
  application: ApplicationType;
}) => {
  const { data: user } = useAuth();
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (!application || !user?.id) return;
    setSelectedStatus(newStatus);
    updateStatus(
      {
        applicationId: application.id,
        userId: user.id,
        status: newStatus,
      },
      {
        onSettled: () => {
          setSelectedStatus(null);
        },
      },
    );
  };
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateApplicationStatus();
  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);
  return (
    <Dropdown
      items={dropdownItems}
      onAction={(key) => handleStatusChange(key as ApplicationStatus)}
      trigger={
        <Button
          type="button"
          className={`${statusInfo.color} border font-semibold px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0`}
          disabled={isUpdatingStatus}
        >
          {isUpdatingStatus && selectedStatus ? (
            <Spinner size="sm" />
          ) : (
            <Icon icon={statusInfo.icon} className="size-4" />
          )}
          {statusInfo.label}
          <Icon icon="heroicons:chevron-down" className="size-3" />
        </Button>
      }
    />
  );
};
