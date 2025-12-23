import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const NotificationIcon = ({
  title = 'badge 13',
  ...props
}: IconProps) => {
  return (
    <svg
      height="32"
      width="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor" strokeLinecap="butt" strokeLinejoin="miter">
        <path
          d="m13.171,28c.412,1.165,1.523,2,2.829,2s2.417-.835,2.829-2"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="m29,25c-2.209,0-4-1.791-4-4v-10c0-4.971-4.029-9-9-9h0c-4.971,0-9,4.029-9,9v10c0,2.209-1.791,4-4,4h26Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
