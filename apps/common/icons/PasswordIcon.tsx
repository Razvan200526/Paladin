import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

export const PasswordIcon = ({ title = 'badge 13', ...props }: IconProps) => {
  return (
    <svg
      height="32"
      width="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill="currentColor">
        <path
          d="m23.587,1l-11.237,11.189c-.621-.126-1.241-.189-1.85-.189-5.238,0-9.5,4.262-9.5,9.5s4.262,9.5,9.5,9.5,9.5-4.262,9.5-9.5c0-.615-.065-1.242-.193-1.871l2.193-2.218v-3.411h4v-4h2.414l2.586-2.586V1h-7.413Zm-14.087,24c-1.381,0-2.5-1.119-2.5-2.5s1.119-2.5,2.5-2.5,2.5,1.119,2.5,2.5-1.119,2.5-2.5,2.5Z"
          fill="currentColor"
          strokeWidth="0"
        />
      </g>
    </svg>
  );
};
