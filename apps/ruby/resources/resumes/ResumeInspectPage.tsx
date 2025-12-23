import { PdfViewer } from '@common/components/pdf/PDFViewer';
import { Skeleton } from '@heroui/react';
import { PageLoader } from '@ruby/shared/components/PageLoader';
import { useAuth } from '@ruby/shared/hooks';
import { NoResumes } from './components/NoResumes';
import { ResumeChat } from './components/ResumeChat';
import { useGetResume } from './hooks';

export const ResumeInspectPage = () => {
  const { data: user } = useAuth();
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
  return (
    <div className="m-4 border border-border rounded h-[calc(100dvh-7rem)] flex flex-row">
      <div className="m-4 rounded-xl flex-1 w-1/2">
        {!isFetching ? (
          <PdfViewer
            src={resumeData.url}
            initialPage={0}
            className="rounded border border-border"
          />
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="m-4 flex-1 max-w-1/2">
        <ResumeChat resume={resumeData} />
      </div>
    </div>
  );
};
