import type { IconProps } from './types';

export function SensorIcon({ 
  className = '', 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2 
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
      <path 
        d="M8.46447 15.5355C6.51185 13.5829 6.51185 10.4171 8.46447 8.46447M5.63592 18.364C2.1212 14.8493 2.1212 9.15077 5.63592 5.63605M15.5355 15.5355C17.4881 13.5829 17.4881 10.4171 15.5355 8.46447M18.364 18.364C21.8788 14.8493 21.8788 9.15077 18.364 5.63605M13 12.0001C13 12.5523 12.5523 13.0001 12 13.0001C11.4477 13.0001 11 12.5523 11 12.0001C11 11.4478 11.4477 11.0001 12 11.0001C12.5523 11.0001 13 11.4478 13 12.0001Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

