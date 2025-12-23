import type { SVGProps } from 'react';

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      >
        <path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
        <path d="M7.5 6.5h-4v-4" />
      </g>
    </svg>
  );
}
