import { UserProfile } from '../../UserProfile';
import { Header } from '../Header';
import { NavMenu } from '../NavMenu';

export const Sidebar = () => {
  return (
    <>
      <Header />

      <NavMenu />

      <UserProfile />
    </>
  );
};
