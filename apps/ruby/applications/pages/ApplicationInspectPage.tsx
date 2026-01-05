import { Button } from '@common/components/button';
import type { ModalRefType } from '@common/components/Modal';
import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { Tooltip } from '@common/components/Tooltip';
import { H4 } from '@common/components/typography';
import { ApplicationsIcon } from '@common/icons/ApplicationsIcon';
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
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
import { useNavigate } from 'react-router';
import { DocumentsSection } from '../components/DocumentsSection';
import { DeleteApplicationModal } from '../components/modals/DeleteApplicationModal';
import { EditApplicationModal } from '../components/modals/EditApplicationModal';
import { NotesSection } from '../components/NotesSection';
import { SuggestionsSections } from '../components/SuggestionsSections';
import {
  useGetApplication,
  useUpdateApplicationStatus,
} from '../hooks/applicationHooks';
import { QuickStats } from '../components/QuickStats';
import { platformConfig, statusConfig } from '../utils/applicationData';

type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

export const ApplicationInspectPage = () => {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const {
    data: application,
    isError,
    isFetching,
    refetch,
  } = useGetApplication();

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
                  size="sm"
                  radius="full"
                  className="rounded-full"
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

            <div className='flex flex-col space-y-2'>
              <QuickStats application={application} />

              <DocumentsSection application={application} />

              <NotesSection application={application} />

              <SuggestionsSections application={application} />

            </div>
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
