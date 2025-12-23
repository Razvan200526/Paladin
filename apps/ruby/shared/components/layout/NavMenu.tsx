import { cn, ScrollShadow } from '@heroui/react';
import { useSideBarItems } from './hooks';
import { NavMenuItem } from './NavMenuItem';

export const NavMenu = ({ isMinimize = false }) => {
  const { mainItems, secondaryItems } = useSideBarItems();

  return (
    <>
      <ScrollShadow
        isEnabled={false}
        className="h-full max-h-full w-full"
        size={8}
      >
        <ul
          className={cn(
            'flex flex-col gap-1',
            isMinimize ? 'items-center justify-center' : 'px-1',
          )}
        >
          {mainItems.map((item) => (
            <li key={item.key} className="w-full flex">
              <NavMenuItem isMinimize={isMinimize} item={item} />
            </li>
          ))}
        </ul>
      </ScrollShadow>
      <div
        className={cn(
          'flex flex-col gap-1',
          isMinimize ? 'w-full! items-center justify-center' : 'px-1',
        )}
      >
        {secondaryItems.map((item, index) => (
          <NavMenuItem key={index} isMinimize={isMinimize} item={item} />
        ))}
      </div>
    </>
  );
};
