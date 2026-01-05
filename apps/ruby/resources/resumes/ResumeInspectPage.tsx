import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { PdfViewer } from '@common/components/pdf/PDFViewer';
import { Tooltip } from '@common/components/Tooltip';
import { H6 } from '@common/components/typography';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { formatDate } from '@common/utils';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Divider,
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { PageLoader } from '@ruby/shared/components/PageLoader';
import { useAuth } from '@ruby/shared/hooks';
import { useNavigate } from 'react-router';
import { NoResumes } from './components/NoResumes';
import { ResumeChat } from './components/ResumeChat';
import { useGetResume } from './hooks';

export const ResumeInspectPage = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();

  const {
    data: resumeData,
    isFetching,
    isError,
  } = useGetResume(user?.id || '');

  if (isFetching) return <PageLoader />;

  if (isError) {
    console.error('There was an error');
    console.error(isError.valueOf);
  }

  if (!resumeData) {
    return <NoResumes />;
  }

  const handleDownload = () => {
    if (resumeData?.url) {
      window.open(resumeData.url, '_blank');
    }
  };

  const getStateChip = () => {
    switch (resumeData.state) {
      case 'ready':
        return (
          <Chip
            size="sm"
            variant="flat"
            className="bg-green-500/10 text-green-700 border-green-500/20"
            startContent={
              <Icon icon="heroicons:check-circle" className="size-3.5" />
            }
          >
            Ready
          </Chip>
        );
      case 'processing':
        return (
          <Chip
            size="sm"
            variant="flat"
            className="bg-amber-500/10 text-amber-700 border-amber-500/20"
            startContent={
              <Icon icon="heroicons:clock" className="size-3.5 animate-spin" />
            }
          >
            Processing
          </Chip>
        );
      case 'failed':
        return (
          <Chip
            size="sm"
            variant="flat"
            className="bg-red-500/10 text-red-700 border-red-500/20"
            startContent={
              <Icon icon="heroicons:x-circle" className="size-3.5" />
            }
          >
            Failed
          </Chip>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background h-[calc(100dvh-4rem)] flex flex-col">
      {/* Header */}
      <nav className="px-4 py-3 border-b border-border bg-background shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip content="Back to Resumes">
              <Button
                variant="light"
                isIconOnly
                radius="full"
                onPress={() => navigate('/home/resources')}
              >
                <ArrowLeftIcon className="size-5 text-resume" />
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
                item: 'text-muted data-[current=true]:text-resume',
                separator: 'text-muted',
              }}
            >
              <BreadcrumbItem
                onPress={() => navigate('/home/resources')}
                startContent={
                  <Icon icon="heroicons:folder" className="size-4" />
                }
              >
                Resources
              </BreadcrumbItem>
              <BreadcrumbItem
                onPress={() => navigate('/home/resources')}
                startContent={<ResumeIcon className="size-4" />}
              >
                Resumes
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent className="text-resume font-medium">
                {resumeData.name?.split('.')[0] || 'Document'}
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>

          <div className="flex items-center gap-2">
            {getStateChip()}

            <Tooltip content="Download">
              <Button
                variant="light"
                isIconOnly
                radius="full"
                onPress={handleDownload}
              >
                <ArrowDownTrayIcon className="size-4 text-resume" />
              </Button>
            </Tooltip>

            <Tooltip content="Share">
              <Button variant="light" isIconOnly radius="full">
                <ShareIcon className="size-4 text-resume" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PDF Viewer Panel */}
          <Card className="h-full flex flex-col overflow-hidden border-resume/20 bg-light">
            <div className="px-4 py-3 border-b border-resume/10 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-resume/10">
                    <ResumeIcon className="size-5 text-resume" />
                  </div>
                  <div>
                    <H6 className="text-resume truncate max-w-50">
                      {resumeData.name?.split('.')[0] || 'Resume'}
                    </H6>
                    <p className="text-xs text-muted">
                      Uploaded {formatDate(resumeData.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-resume/10 text-resume"
                  >
                    PDF
                  </Chip>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              {!isFetching ? (
                <PdfViewer
                  toolbar={true}
                  src={resumeData.url}
                  initialPage={0}
                  className="rounded-lg border border-resume/20 h-full"
                />
              ) : (
                <div className="h-full flex flex-col gap-4">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <Skeleton className="flex-1 w-full rounded-lg" />
                </div>
              )}
            </div>
          </Card>

          {/* Chat Panel */}
          <div className="h-full overflow-hidden">
            <ResumeChat resume={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};
