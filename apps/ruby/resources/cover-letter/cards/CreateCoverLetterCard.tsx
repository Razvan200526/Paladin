import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { CreateCoverLetterButton } from '../buttons/CreateCoverLetterButton';

export const CreateCoverLetterCard = () => {
  return (
    <Card className="rounded border-coverletter/50 bg-coverletter/10 h-full flex flex-col">
      <div className="flex items-center justify-center">
        <div className="h-37.5 flex flex-col items-center justify-center">
          <H6 className="text-coverletter p-4 text-xl">
            Create or upload a cover letter
          </H6>
          <CreateCoverLetterButton />
        </div>
      </div>
    </Card>
  );
};
