import type { IconProps } from './types';

export function EmptyIcon({ 
  className = '', 
  size = 24
}: IconProps) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Empty icon - no visible content */}
    </svg>
  );
}

