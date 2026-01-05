import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { PdfViewer } from '@common/components/pdf/PDFViewer';
import { Tooltip } from '@common/components/Tooltip';
import { H6 } from '@common/components/typography';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
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
import { useGetCoverLetter } from '../../resumes/hooks';
import { CoverLetterChat } from '../chat/CoverLetterChat';
import { NoCoverLetters } from './../NoCoverLetters';

export const CoverLetterInspectPage = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();

  const {
    data: coverLetterData,
    isFetching,
    isError,
  } = useGetCoverLetter(user?.id || '');

  if (isFetching) return <PageLoader />;

  if (isError) {
    console.error('There was an error');
  }

  if (!coverLetterData) {
    return <NoCoverLetters />;
  }

  const handleDownload = () => {
    if (coverLetterData?.url) {
      window.open(coverLetterData.url, '_blank');
    }
  };

  const getStateChip = () => {
    switch (coverLetterData.state) {
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
            <Tooltip content="Back to Cover Letters">
              <Button
                variant="light"
                isIconOnly
                radius="full"
                onPress={() => navigate('/home/resources/coverletter')}
              >
                <ArrowLeftIcon className="size-5 text-coverletter" />
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
                item: 'text-muted data-[current=true]:text-coverletter',
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
                onPress={() => navigate('/home/resources/coverletter')}
                startContent={<CoverLetterIcon className="size-4" />}
              >
                Cover Letters
              </BreadcrumbItem>
              <BreadcrumbItem
                isCurrent
                className="text-coverletter font-medium"
              >
                {coverLetterData.name?.split('.')[0] || 'Document'}
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
                <ArrowDownTrayIcon className="size-4 text-coverletter" />
              </Button>
            </Tooltip>

            <Tooltip content="Share">
              <Button variant="light" isIconOnly radius="full">
                <ShareIcon className="size-4 text-coverletter" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PDF Viewer Panel */}
          <Card className="h-full flex flex-col overflow-hidden border-coverletter/20 bg-light">
            <div className="px-4 py-3 border-b border-coverletter/10 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-coverletter/10">
                    <CoverLetterIcon className="size-5 text-coverletter" />
                  </div>
                  <div>
                    <H6 className="text-coverletter truncate max-w-50">
                      {coverLetterData.name?.split('.')[0] || 'Cover Letter'}
                    </H6>
                    <p className="text-xs text-muted">
                      Uploaded {formatDate(coverLetterData.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-coverletter/10 text-coverletter"
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
                  src={coverLetterData.url}
                  initialPage={0}
                  className="rounded-lg border border-coverletter/20 h-full"
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
            <CoverLetterChat coverletter={coverLetterData} />
          </div>
        </div>
      </div>
    </div>
  );
};
