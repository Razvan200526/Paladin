import { addToast, cn } from '@heroui/react';

const classNames = {
  base: cn(['bg-light shadow-none']),
};

export const Toast = {
  success: (config: { title?: string; description?: string }) => {
    addToast({
      ...config,
      color: 'success',
      variant: 'flat',
      radius: 'sm',
      classNames: {
        ...classNames,
      },
    });
  },
  error: (config: { title?: string; description?: string }) => {
    addToast({
      ...config,
      color: 'danger',
      variant: 'bordered',
      radius: 'sm',
      classNames: {
        ...classNames,
      },
    });
  },
  warning: (config: { title?: string; description?: string }) => {
    addToast({
      ...config,
      color: 'warning',
      variant: 'flat',
      radius: 'sm',
      classNames: {
        ...classNames,
      },
    });
  },
  info: (config: { title?: string; description?: string }) => {
    addToast({
      ...config,
      color: 'primary',
      variant: 'flat',
      radius: 'sm',
      classNames: {
        ...classNames,
      },
    });
  },
};
