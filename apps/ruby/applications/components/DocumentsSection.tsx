import { Button } from '@common/components/button';
import { PdfPreviewImage } from '@common/components/pdf/PDFPreviewImage';
import { H6 } from '@common/components/typography';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { useState } from 'react';

export const DocumentsSection = ({
  application,
}: {
  application: ApplicationType;
}) => {
  const [isShowingResume, setIsShowingResume] = useState(false);
  const [isShowingCoverLetter, setIsShowingCoverLetter] = useState(false);

  const handleResumeClick = () => {
    setIsShowingResume(!isShowingResume);
  };

  const handleCoverLetterClick = () => {
    setIsShowingCoverLetter(!isShowingCoverLetter);
  };

  return (
    <div>
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
                    <p className="text-sm font-medium text-primary">Resume</p>
                    <p className="text-xs text-muted truncate">
                      {application.resume.name}
                    </p>
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    isIconOnly
                    radius="full"
                    onClick={handleResumeClick}
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
                    onClick={handleCoverLetterClick}
                  >
                    <Icon icon="heroicons:eye" className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isShowingResume ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleResumeClick}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-out ${
            isShowingResume ? 'translatex-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-primary">Resume</h3>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              radius="full"
              onClick={handleResumeClick}
            >
              <Icon icon="heroicons:x-mark" className="size-5" />
            </Button>
          </div>
          <div className="p-4 h-[calc(100%-65px)] overflow-auto">
            <PdfPreviewImage src={application.resume?.url || ''} />
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isShowingCoverLetter ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleCoverLetterClick}
        />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-out ${
            isShowingCoverLetter ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-primary">Cover Letter</h3>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              radius="full"
              onClick={handleCoverLetterClick}
            >
              <Icon icon="heroicons:x-mark" className="size-5" />
            </Button>
          </div>
          <div className="p-4 h-[calc(100%-65px)] overflow-auto">
            <PdfPreviewImage src={application.coverletter?.url || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};
