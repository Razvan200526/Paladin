import { PdfViewer } from '@common/components/pdf/PDFViewer';
import { Skeleton } from '@heroui/react';
import { PageLoader } from '@ruby/shared/components/PageLoader';
import { useAuth } from '@ruby/shared/hooks';
import { useGetCoverLetter } from '../../resumes/hooks';
import { CoverLetterChat } from '../chat/CoverLetterChat';
import { NoCoverLetters } from './../NoCoverLetters';

export const CoverLetterInspectPage = () => {
  const { data: user } = useAuth();

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

  return (
    <div className="m-4 border border-border rounded h-[calc(100dvh-7rem)] flex flex-row">
      <div className="m-4 rounded-xl flex-1">
        {!isFetching ? (
          <PdfViewer
            toolbar={true}
            src={coverLetterData.url}
            initialPage={0}
            className="rounded border border-coverletter/20"
          />
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="m-4 flex-1">
        <CoverLetterChat coverletter={coverLetterData} />
      </div>
    </div>
  );
};
