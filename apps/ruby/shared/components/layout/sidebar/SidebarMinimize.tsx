import { Avatar, AvatarIcon } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { HeaderMinimize } from '../HeaderMinimize';
import { NavMenu } from '../NavMenu';

export const SidebarMinimize = ({ onOpen }: { onOpen: () => void }) => {
  const { data: user } = useAuth();
  return (
    <>
      <HeaderMinimize />
      <NavMenu isMinimize={true} />
      <button
        type="button"
        onClick={onOpen}
        className="cursor-pointer flex hover:bg-hover w-full h-16 items-center justify-center px-2 py-2.5 rounded"
      >
        <Avatar
          src={user?.image}
          radius="full"
          fallback={<AvatarIcon />}
          className="w-8 h-8"
        />
      </button>
    </>
  );
};
