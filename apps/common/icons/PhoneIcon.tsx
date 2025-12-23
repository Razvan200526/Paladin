import type { SVGProps } from 'react';

export const PhoneIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.26-.26.35-.63.24-1.01a17.9 17.9 0 0 0-.56-3.53.987.987 0 0 0-.96-.75H3.97c-.55 0-1 .45-1 1c0 9.39 7.61 17 17 17c.55 0 1-.45 1-1v-4.03c0-.53-.41-.96-.96-.96Z"
        fill="currentColor"
      />
    </svg>
  );
};
