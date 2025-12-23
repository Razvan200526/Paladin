import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { H4 } from '@common/components/typography';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

export const FeatureNotImplemented = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full w-full bg-background">
      <Card className="p-8 flex flex-col items-center gap-4 max-w-md text-center">
        <ExclamationCircleIcon className="w-16 h-16 text-secondary-text" />
        <H4>Feature not available</H4>
        <p className="text-secondary-text font-semibold">
          We're working hard to bring you this feature. Please check back later!
        </p>
        <Button onPress={() => navigate(-1)} color="primary" className="mt-4">
          Go Back
        </Button>
      </Card>
    </div>
  );
};
