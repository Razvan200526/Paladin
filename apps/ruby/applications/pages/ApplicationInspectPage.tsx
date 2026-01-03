import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import type { ModalRefType } from '@common/components/Modal';
import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { Tooltip } from '@common/components/Tooltip';
import { H4, H6 } from '@common/components/typography';
import { ApplicationsIcon } from '@common/icons/ApplicationsIcon';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Divider,
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
      <div className="bg-background h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-background h-full flex items-center justify-center">
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
      <div className="bg-background h-full flex flex-col">
        <nav className="px-4 py-3 border-b border-border bg-background shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip content="Back to Applications">
                <Button
                  variant="light"
                  isIconOnly
                  size='sm'
                  radius="full"
                  className='rounded-full'
                  onPress={() => navigate('/home/applications')}
                >
                  <ArrowLeftIcon className=" size-4 text-primary" />
                </Button>
              </Tooltip>

              <Divider orientation="vertical" className="h-6" />

              <Breadcrumbs
                size="sm"
                variant="light"
                classNames={{
                  list: 'gap-1',
                }}
                itemClasses={{
                  item: 'text-muted data-[current=true]:text-primary',
                  separator: 'text-muted',
                }}
              >
                <BreadcrumbItem
                  onPress={() => navigate('/home/applications')}
                  startContent={<ApplicationsIcon className="size-4" />}
                >
                  Applications
                </BreadcrumbItem>
                <BreadcrumbItem isCurrent className="text-primary font-medium">
                  {application.jobTitle}
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip content="Edit Application">
                <Button
                  variant="light"
                  isIconOnly
                  radius="full"
                  onPress={() => editModalRef.current?.open()}
                >
                  <PencilIcon className="size-4 text-primary" />
                </Button>
              </Tooltip>

              <Tooltip content="Delete Application">
                <Button
                  variant="light"
                  isIconOnly
                  radius="full"
                  color="danger"
                  onPress={() => deleteRef.current?.open()}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </nav>

        <ScrollShadow className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <ApplicationsIcon className="size-8 text-primary" />
                </div>
                <div>
                  <H4 className="text-primary text-xl">
                    {application.jobTitle}
                  </H4>
                  <p className="text-secondary-text text-base">
                    {application.employer}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-background border border-border"
                      startContent={
                        <Icon
                          icon={platformInfo.icon}
                          className={`size-3.5 ${platformInfo.color}`}
                        />
                      }
                    >
                      {platformInfo.label}
                    </Chip>
                    {application.location && (
                      <Chip
                        size="sm"
                        variant="flat"
                        className="bg-background border border-border"
                        startContent={
                          <MapPinIcon className="size-3.5 text-muted" />
                        }
                      >
                        {application.location}
                      </Chip>
                    )}
                    {application.salaryRange && (
                      <Chip
                        size="sm"
                        variant="flat"
                        className="bg-green-500/10 text-green-700 border-green-500/20"
                        startContent={
                          <CurrencyDollarIcon className="size-3.5" />
                        }
                      >
                        {application.salaryRange}
                      </Chip>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <button
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
                      <Icon icon="heroicons:document-text" className="size-4" />
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
                      <Icon icon="heroicons:check-circle" className="size-4" />
                    }
                  >
                    Accepted
                  </DropdownItem>
                  <DropdownItem
                    key="Rejected"
                    startContent={
                      <Icon icon="heroicons:x-circle" className="size-4" />
                    }
                  >
                    Rejected
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Divider />

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-light border border-border">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <CalendarIcon className="size-4" />
                  Applied
                </div>
                <p className="font-semibold text-primary text-sm">
                  {new Date(application.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-light border border-border">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <ClockIcon className="size-4" />
                  Last Updated
                </div>
                <p className="font-semibold text-primary text-sm">
                  {new Date(application.updatedAt).toLocaleDateString(
                    undefined,
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </p>
              </div>
              {application.contact && (
                <div className="p-4 rounded-xl bg-light border border-border">
                  <div className="flex items-center gap-2 text-muted text-xs mb-1">
                    <UserIcon className="size-4" />
                    Contact
                  </div>
                  <p className="font-semibold text-primary text-sm truncate">
                    {application.contact}
                  </p>
                </div>
              )}
              {application.jobUrl && (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-light border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-muted text-xs mb-1">
                    <ArrowTopRightOnSquareIcon className="size-4" />
                    Job Posting
                  </div>
                  <p className="font-semibold text-primary text-sm group-hover:underline">
                    View Original
                  </p>
                </a>
              )}
            </div>

            {/* Documents Section */}
            {(application.resume || application.coverletter) && (
              <>
                <Divider />
                <div>
                  <H6 className="text-primary mb-3">Attached Documents</H6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {application.resume && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-light border border-border hover:border-blue-500/30 transition-colors cursor-pointer">
                        <div className="p-2.5 rounded-lg bg-blue-500/10">
                          <Icon
                            icon="heroicons:document-text"
                            className="size-5 text-blue-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary">
                            Resume
                          </p>
                          <p className="text-xs text-muted truncate">
                            {application.resume.name}
                          </p>
                        </div>
                        <Button
                          variant="light"
                          size="sm"
                          isIconOnly
                          radius="full"
                        >
                          <Icon icon="heroicons:eye" className="size-4" />
                        </Button>
                      </div>
                    )}
                    {application.coverletter && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-light border border-border hover:border-green-500/30 transition-colors cursor-pointer">
                        <div className="p-2.5 rounded-lg bg-green-500/10">
                          <Icon
                            icon="heroicons:document-text"
                            className="size-5 text-green-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary">
                            Cover Letter
                          </p>
                          <p className="text-xs text-muted truncate">
                            {application.coverletter.name}
                          </p>
                        </div>
                        <Button
                          variant="light"
                          size="sm"
                          isIconOnly
                          radius="full"
                        >
                          <Icon icon="heroicons:eye" className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notes Section */}
            {application.comments?.length > 0 && (
              <>
                <Divider />
                <div>
                  <H6 className="text-primary mb-3">Notes</H6>
                  <div className="space-y-2">
                    {application.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-light border border-border"
                      >
                        <Icon
                          icon="heroicons:chat-bubble-left"
                          className="size-4 text-primary mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-secondary-text">{comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Suggestions Section */}
            {application.suggestions?.length > 0 && (
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
                        <p className="text-sm text-secondary-text">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollShadow>
      </div>

      <DeleteApplicationModal application={application} modalRef={deleteRef} />

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
