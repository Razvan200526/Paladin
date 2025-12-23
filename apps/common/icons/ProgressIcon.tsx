import type { SVGProps } from 'react';

export const ProgressIcon = (props: SVGProps<SVGSVGElement>) => {
  const css =
    '.nc-loop-circle-3-24-icon-o{--animation-duration:0.7s;transform-origin:12px 12px;animation:nc-loop-circle-3-anim var(--animation-duration) infinite linear}@keyframes nc-loop-circle-3-anim{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}';

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
        <g className="nc-loop-circle-3-24-icon-o">
          <path
            d="M21 18.326A11 11 0 1 1 23 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>
        <style>{css}</style>
      </g>
    </svg>
  );
};
