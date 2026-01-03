import { Drawer, DrawerContent } from '@heroui/react';
import type { JobMatch } from '@sdk/JobFetcher';
import { JobMatchDetail } from './JobMatchDetail';

interface JobDetailDrawerProps {
  selectedMatch: JobMatch | undefined;
  onClose: () => void;
}

export const JobDetailDrawer = ({
  selectedMatch,
  onClose,
}: JobDetailDrawerProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <Drawer
      isOpen={!!selectedMatch && isMobile}
      onClose={onClose}
      size="full"
      placement="right"
    >
      <DrawerContent>
        {selectedMatch && <JobMatchDetail match={selectedMatch} />}
      </DrawerContent>
    </Drawer>
  );
};
