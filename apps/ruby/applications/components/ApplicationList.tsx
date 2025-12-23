import type { ApplicationType } from '@client/sdk/types';
import { Link } from 'react-router';
import { ApplicationCard } from './ApplicationCard';

export const ApplicationList = ({
  applications,
}: {
  applications: ApplicationType[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
      {applications.map((application) => (
        <Link to={`/home/applications/${application.id}`} key={application.id}>
          <ApplicationCard application={application} />
        </Link>
      ))}
    </div>
  );
};
