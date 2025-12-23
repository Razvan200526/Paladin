import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const EmailIcon = ({ title = 'badge 13', ...props }: IconProps) => {
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor" strokeLinecap="butt" strokeLinejoin="miter">
        <polyline
          fill="none"
          points="2 8 12 13 22 8"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <rect
          height="16"
          width="20"
          fill="none"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
          x="2"
          y="4"
        />
      </g>
    </svg>
  );
};
