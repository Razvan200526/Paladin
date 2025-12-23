import { Logo } from '@common/icons/Logo';
import { Link } from 'react-router';

export const HeaderMinimize = () => {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="bg-background flex h-8 w-8 items-center justify-center rounded-full">
        <Link to={'/home'}>
          <Logo className="size-8 text-primary" />
        </Link>
      </div>
    </div>
  );
};
