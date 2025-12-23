import type { SVGProps } from 'react';

export const ProfileIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      >
        <circle
          cx="12"
          cy="9.5"
          fill="none"
          r="2.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m17.917,20.048c-.457-2.86-2.928-5.048-5.917-5.048s-5.46,2.188-5.917,5.048"
          fill="none"
          stroke="currentColor"
          strokeLinecap="butt"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
