import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const EyeOpenIcon = ({ title = 'badge 13', ...props }: IconProps) => {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor">
        <path
          d="M1.859,8c1.815-1.851,4.344-3,7.141-3s5.326,1.148,7.141,3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          cx="9"
          cy="10.5"
          fill="none"
          r="2.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="4.021"
          x2="2.75"
          y1="6.328"
          y2="4.25"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="7.3"
          x2="6.823"
          y1="5.144"
          y2="2.769"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="13.979"
          x2="15.25"
          y1="6.328"
          y2="4.25"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="10.7"
          x2="11.177"
          y1="5.144"
          y2="2.769"
        />
      </g>
    </svg>
  );
};
