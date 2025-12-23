import type { SVGProps } from 'react';

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => {
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
          d="M20.7,9.4c0.2,0.8,0.3,1.7,0.3,2.6 c0,5.5-4.5,10-10,10S1,17.5,1,12S5.5,2,11,2c1.9,0,3.7,0.5,5.3,1.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="butt"
          strokeWidth="2"
        />
        <polyline
          fill="none"
          points=" 7,10 11,14 22,3 "
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
