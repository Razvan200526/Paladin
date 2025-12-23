import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const SaveIcon = ({ title = 'badge 13', ...props }: IconProps) => {
  return (
    <svg
      height="32"
      width="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      color="#ffffff"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor" strokeLinecap="butt" strokeLinejoin="miter">
        <polyline
          fill="none"
          points="16 3 16 21 16 20"
          stroke="#ffffff"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <polyline
          fill="none"
          points="9 14 16 21 23 14"
          stroke="#ffffff"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="m3,22v4c0,1.657,1.343,3,3,3h20c1.657,0,3-1.343,3-3v-4"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
