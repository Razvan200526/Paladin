import type { ResourceOutletContext } from '@client/resources/ResourceLayout';
import { ScrollShadow } from '@heroui/react';
import { useOutletContext } from 'react-router';
import { CoverletterList } from '../components/CoverletterList';
import { FilteredCoverlettersHeader } from '../components/FilteredCoverlettersHeader';
import { NoCoverLetters } from '../NoCoverLetters';

export const CoverLettersPage = () => {
  const { coverlettersLoading, filteredCoverLetters, totalCoverLetters } =
    useOutletContext<ResourceOutletContext>();

  if (totalCoverLetters === 0) {
    return <NoCoverLetters />;
  }

  return (
    <div className="m-4 bg-background h-[calc(100dvh-7rem)] rounded">
      <ScrollShadow size={8} className="h-full overflow-y-scroll">
        <div className="p-4">
          {filteredCoverLetters && (
            <FilteredCoverlettersHeader totalCoverletters={totalCoverLetters} />
          )}

          <CoverletterList
            coverletterLoading={coverlettersLoading}
            filteredCoverletters={filteredCoverLetters}
          />
        </div>
      </ScrollShadow>
    </div>
  );
};
