import { Button } from '@common/components/button';
import type { ModalRefType } from '@common/components/Modal';
import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { H3, H4, H6 } from '@common/components/typography';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { DeleteApplicationModal } from '../components/DeleteApplicationModal';
import { EditApplicationModal } from '../components/EditApplicationModal';
import {
  useGetApplication,
  useUpdateApplicationStatus,
} from '../hooks/applicationHooks';
import { ActionTimeline } from '../components/ActionTimeline';
import { RelatedDocuments } from '../components/RelatedDocuments';
import { QuickStats } from '../components/QuickStats';
import { CommentsAndSuggestions } from '../components/CommentsAndSuggestions';
import { JobInformation } from '../components/JobInformation';

const statusConfig = {
  Applied: {
    color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    label: 'Applied',
    icon: 'heroicons:document-text',
  },
  Interviewing: {
    color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    label: 'Interviewing',
    icon: 'heroicons:chat-bubble-left-right',
  },
  Accepted: {
    color: 'bg-green-500/10 text-green-700 border-green-500/20',
    label: 'Accepted',
    icon: 'heroicons:check-circle',
  },
  Rejected: {
    color: 'bg-red-500/10 text-red-700 border-red-500/20',
    label: 'Rejected',
    icon: 'heroicons:x-circle',
  },
};

const platformConfig = {
  Linkedin: {
    icon: 'mdi:linkedin',
    color: 'text-[#0077B5]',
    label: 'LinkedIn',
  },
  Glassdoor: {
    icon: 'simple-icons:glassdoor',
    color: 'text-[#0CAA41]',
    label: 'Glassdoor',
  },
  Other: {
    icon: 'heroicons:briefcase',
    color: 'text-primary',
    label: 'Other',
  },
};

type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

export const ApplicationInspectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const {
    data: application,
    isError,
    isFetching,
    refetch,
  } = useGetApplication(id || '');

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateApplicationStatus();

  const deleteRef = useRef<ModalRefType | null>(null);
  const editModalRef = useRef<ModalRefType>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

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

  const handleEditSuccess = () => {
    refetch();
  };

  if (isFetching || !application) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <ErrorFallback error={new Error('Could not fetch application')} />
      </div>
    );
  }

  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];
  const platformInfo =
    platformConfig[application.platform as keyof typeof platformConfig];

  return (
    <>
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded">
        <ScrollShadow className="h-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="light"
                  isIconOnly
                  onPress={() => navigate('/home/applications')}
                >
                  <ArrowLeftIcon className="size-5" />
                </Button>
                <div>
                  <H3 className="text-primary font-bold">
                    {application.jobTitle}
                  </H3>
                  <H6 className="text-muted">{application.employer}</H6>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<PencilIcon className="size-4" />}
                  onPress={() => editModalRef.current?.open()}
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  color="danger"
                  startContent={<TrashIcon className="size-4" />}
                  onPress={() => deleteRef.current?.open()}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status & Platform */}
                <div className="bg-light border border-border rounded-lg p-4">
                  <H4 className="mb-4">Status & Details</H4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={statusInfo.icon}
                          className="size-5 text-primary"
                        />
                        <span className="text-sm font-medium">Status:</span>
                      </div>
                      <Dropdown>
                        <DropdownTrigger>
                          <button
                            type="button"
                            className={`${statusInfo.color} border font-semibold px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}
                            disabled={isUpdatingStatus}
                          >
                            {isUpdatingStatus && selectedStatus ? (
                              <Spinner size="sm" className="mr-1" />
                            ) : null}
                            {statusInfo.label}
                            <Icon
                              icon="heroicons:chevron-down"
                              className="size-3"
                            />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Change application status"
                          onAction={(key) =>
                            handleStatusChange(key as ApplicationStatus)
                          }
                          disabledKeys={[application.status]}
                        >
                          <DropdownItem
                            key="Applied"
                            startContent={
                              <Icon
                                icon="heroicons:document-text"
                                className="size-4"
                              />
                            }
                          >
                            Applied
                          </DropdownItem>
                          <DropdownItem
                            key="Interviewing"
                            startContent={
                              <Icon
                                icon="heroicons:chat-bubble-left-right"
                                className="size-4"
                              />
                            }
                          >
                            Interviewing
                          </DropdownItem>
                          <DropdownItem
                            key="Accepted"
                            startContent={
                              <Icon
                                icon="heroicons:check-circle"
                                className="size-4"
                              />
                            }
                          >
                            Accepted
                          </DropdownItem>
                          <DropdownItem
                            key="Rejected"
                            startContent={
                              <Icon
                                icon="heroicons:x-circle"
                                className="size-4"
                              />
                            }
                          >
                            Rejected
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={platformInfo.icon}
                          className={`size-5 ${platformInfo.color}`}
                        />
                        <span className="text-sm font-medium">Platform:</span>
                      </div>
                      <span className="text-sm text-secondary-text">
                        {platformInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                <JobInformation application={application} />

                <CommentsAndSuggestions application={application} />
              </div>

              <div className="space-y-6">
                <QuickStats application={application} statusInfo={statusInfo} />

                <RelatedDocuments application={application} />

                <ActionTimeline application={application} statusInfo={statusInfo} />
              </div>
            </div>
          </div>
        </ScrollShadow>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteApplicationModal application={application} modalRef={deleteRef} />

      {/* Edit Application Modal */}
      {application && (
        <EditApplicationModal
          modalRef={editModalRef}
          application={application}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
