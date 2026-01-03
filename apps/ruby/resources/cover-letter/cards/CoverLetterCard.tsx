import { Card } from '@common/components/card';
import { SuccessChip } from '@common/components/chips/SuccesChip';
import { PdfPreviewImage } from '@common/components/pdf/PDFPreviewImage';
import { H6 } from '@common/components/typography';
import { formatDate } from '@common/utils';
import { Checkbox } from '@heroui/react';
import type { CoverLetterType } from '@sdk/types';
import { useDeleteStore } from '../../store';

type CoverLetterCardProps = {
  coverLetter: CoverLetterType;
};

export const CoverLetterCard = ({ coverLetter }: CoverLetterCardProps) => {
  const { state, addToDeleteCoverletters, removeFromDeleteCoverletters } =
    useDeleteStore();
  return (
    <Card className="h-62.5 relative flex flex-col border border-border transition-all duration-300 hover:border-border-hover ease-in-out w-full">
      <SuccessChip className="absolute top-1 left-1 z-50">Success</SuccessChip>
      <div className="h-full w-full rounded flex items-center justify-center">
        {state && (
          <Checkbox
            className="absolute top-7 right-5 z-50"
            color="danger"
            onValueChange={(isSelected) => {
              if (isSelected) {
                addToDeleteCoverletters(coverLetter.id);
              } else {
                removeFromDeleteCoverletters(coverLetter.id);
              }
            }}
          />
        )}
        <div className="h-full">
          <PdfPreviewImage src={coverLetter.url} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-10 w-full flex flex-col space-y-1 bg-background rounded-b-lg border-t border-border transition-all duration-300 hover:border-book/50 h-1/3 p-4">
        <div className="flex text-center justify-center">
          <H6 className="truncate">{coverLetter.name.split('.')[0]}</H6>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-secondary-text text-sm">
            Uploaded {formatDate(coverLetter.uploadedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
};
