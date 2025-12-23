import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const ResourceIcon = ({ title = 'badge 13', ...props }: IconProps) => {
  return (
    <svg
      height="48"
      width="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor">
        <path
          d="M12 2C8.68629 2 6 4.68629 6 8V40C6 43.3137 8.68629 46 12 46H36C39.3137 46 42 43.3137 42 40V8C42 4.68629 39.3137 2 36 2H12ZM12 8H36V22H12V8ZM36 25H12V28H36V25ZM12 31H36V34H12V31ZM26 37H12V40H26V37Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};
