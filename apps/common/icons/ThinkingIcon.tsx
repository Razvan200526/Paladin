import type { SVGProps } from 'react';

export const ThinkingIcon = (props: SVGProps<SVGSVGElement>) => {
  const css = `
    .nc-loop-dots-3-24-icon-f > * {
      --animation-duration: 0.8s;
      transform-origin: 50% 50%;
      animation: nc-loop-dots-3-anim var(--animation-duration) infinite;
    }
    .nc-loop-dots-3-24-icon-f > :nth-child(2) {
      animation-delay: 0.1s;
    }
    .nc-loop-dots-3-24-icon-f > :nth-child(3) {
      animation-delay: 0.2s;
    }
    @keyframes nc-loop-dots-3-anim {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(20%);
      }
    }
  `;

  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="currentColor">
        <g className="nc-loop-dots-3-24-icon-f">
          <circle cx="3" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="21" cy="12" r="2" />
        </g>
        <style>{css}</style>
      </g>
    </svg>
  );
};
