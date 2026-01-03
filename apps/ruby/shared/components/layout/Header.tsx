import { Button } from '@common/components/button';
import { Tooltip } from '@common/components/Tooltip';
import { H4 } from '@common/components/typography';
import { Logo } from '@common/icons/Logo';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { NotificationBell } from '@ruby/notifications';
import { useAppSidebarStore } from '../../../appStore';

export const Header = () => {
  const { close: closeSidebar, isOpen } = useAppSidebarStore();

  return (
    <div className="flex items-center justify-between pt-2 pr-2">
      <div className="flex items-center gap-2 px-2 w-full">
        <div className="flex w-full items-center text-center gap-3">
          <Logo className="size-8" />
          {isOpen && <H4 className="text-primary pt-1">Easyres</H4>}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5">
        {isOpen ? (
          <Tooltip content="Minimize sidebar">
            <Button
              isIconOnly={true}
              className="rounded-full"
              variant="light"
              color="primary"
              onPress={() => {
                closeSidebar();
              }}
            >
              <ChevronRightIcon className="size-4 rotate-180" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content="Minimize sidebar">
            <Button
              isIconOnly={true}
              className="rounded-full"
              variant="light"
              color="primary"
              onPress={close}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
          </Tooltip>
        )}

        <NotificationBell />
      </div>
    </div>
  );
};
