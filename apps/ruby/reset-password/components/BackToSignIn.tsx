import { Link } from '@common/components/Link';
import { H6 } from '@common/components/typography';

export const BackToSignIn = () => {
  return (
    <H6 className="text-center text-sm font-primary font-normal flex items-center justify-center gap-1">
      Remember your password?
      <Link className="text-secondary-text" to="/signin">
        Sign in
      </Link>
    </H6>
  );
};
