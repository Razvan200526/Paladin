import { HeroUIProvider } from '@heroui/react';
import { ToastProvider as HeroToastProvider } from '@heroui/toast';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider className="min-h-dvh">
      <HeroToastProvider placement="top-center" />
      {children}
    </HeroUIProvider>
  );
};
