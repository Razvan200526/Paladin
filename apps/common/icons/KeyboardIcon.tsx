import type { SVGProps } from 'react';

export const KeyboardIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <path
          d="M4 18L20 18C21.1046 18 22 17.1046 22 16L22 8.00001C22 6.89544 21.1046 6.00001 20 6.00001L4 6.00001C2.89543 6.00001 2 6.89544 2 8.00001L2 16C2 17.1046 2.89543 18 4 18Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M6 10H6.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 10H10.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 14H14" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M6 14H6.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M18 14H18.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 10H14.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M18 10H18.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
