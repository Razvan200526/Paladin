import { Button } from '@common/components/button';
import type { ModalRefType } from '@common/components/Modal';
import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { Tooltip } from '@common/components/Tooltip';
import { ApplicationsIcon } from '@common/icons/ApplicationsIcon';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { BreadcrumbItem, Breadcrumbs, Divider, Spinner } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApplicationDetails } from '../components/ApplicationDetails';
import { DeleteApplicationModal } from '../components/modals/DeleteApplicationModal';
import { EditApplicationModal } from '../components/modals/EditApplicationModal';
import {
  useGetApplication,
  useUpdateApplicationStatus,
} from '../hooks/applicationHooks';

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

  const { mutate: updateStatus, isPending: _isUpdatingStatus } =
    useUpdateApplicationStatus();

  const deleteRef = useRef<ModalRefType | null>(null);
  const editModalRef = useRef<ModalRefType>(null);
  const [_selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

  const _handleStatusChange = (newStatus: ApplicationStatus) => {
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

        <ApplicationDetails application={application} />
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
