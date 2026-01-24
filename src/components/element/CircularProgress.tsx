'use client';

import * as React from 'react';
import { cn } from '@/utils/helpers/cn';

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value: number;
  /**
   * Size of the circle (default: w-40 h-40)
   */
  size?: number;
  /**
   * Stroke width
   */
  strokeWidth?: number;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value, size = 40, strokeWidth = 4, className, ...props }, ref) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);
    
    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    // Gap of 4px
    const gap = 6;
    
    // Calculate dasharray and offset for filled progress (blue-700)
    const filledLength = clampedValue === 100 
      ? circumference 
      : (clampedValue / 100) * (circumference - gap);
    const filledOffset = 0;
    
    // Calculate dasharray and offset for unfilled progress (blue-100)
    const unfilledLength = clampedValue === 0
      ? circumference
      : ((100 - clampedValue) / 100) * (circumference - gap);
    const unfilledOffset = -(filledLength + gap);
    
    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {/* Unfilled progress circle (blue-100) - decreases as progress increases */}
          {clampedValue < 100 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-blue-100"
              style={{
                strokeDasharray: clampedValue === 0 
                  ? `${circumference} ${circumference}`
                  : `${unfilledLength - 6} ${circumference}`,
                strokeDashoffset: clampedValue === 0 ? 0 : unfilledOffset,
              }}
            />
          )}
          
          {/* Filled progress circle (blue-700) - increases as progress increases */}
          {clampedValue > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-blue-700"
              style={{
                strokeDasharray: clampedValue === 100
                  ? `${circumference} ${circumference}`
                  : `${filledLength} ${circumference}`,
                strokeDashoffset: filledOffset,
              }}
            />
          )}
        </svg>
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress };
export type { CircularProgressProps };
