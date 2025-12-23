import { H4 } from '@common/components/typography';
import { CoverLetterIcon } from '@common/icons/CoverletterIcon';
import { CreateCoverLetterButton } from './buttons/CreateCoverLetterButton';

export const NoCoverLetters = () => {
  return (
    <div className="h-[calc(100dvh-7rem)] m-4">
      <div className="flex items-center justify-center h-full border border-border rounded">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <CoverLetterIcon className="size-7 m-2 text-secondary-text" />
            <H4>Get started by adding your first cover letter!</H4>
          </div>
          <CreateCoverLetterButton />
        </div>
      </div>
    </div>
  );
};
