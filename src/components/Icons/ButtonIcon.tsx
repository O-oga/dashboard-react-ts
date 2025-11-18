import type { IconProps } from './types';

export function ButtonIcon({ 
  className = '', 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 16 
}: IconProps) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M87.4437 138C161.802 140.983 236.338 138 310.73 138C346.817 138 372.438 166.502 374.814 183.568C377.189 200.634 382.817 249.045 326.037 256.563C269.257 264.08 119.949 262.847 90.8109 259.705C61.6729 256.563 23 249.637 23 200.634C23 151.631 58.4746 139.535 64.8412 139.535" 
        stroke={color} 
        strokeOpacity="0.9" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

