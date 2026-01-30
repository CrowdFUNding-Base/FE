import React from 'react';
import { cn } from '@/utils/helpers/cn';

interface ProgressBarProps {
  collected: number; // terkumpul
  total: number;     // diperlukan
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace('.0', '')}K`;
  }
  return num.toString();
};

export default function ProgressBar({
  collected,
  total,
  className,
}: ProgressBarProps) {
  const progress = Math.min(collected / total, 1);
  const progressPercent = progress * 100;
  const isCompleted = collected >= total;

  return (
    <div
      className={cn(
        'flex w-full max-w-lg flex-col items-start gap-1',
        className
      )}
    >
      {/* Progress Bar */}
      <div className="flex w-full items-start gap-1.5">
        {/* Filled */}
        <div
          className="h-2 rounded bg-blue-700 transition-all"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Remaining */}
        <div
          className="h-2 flex-1 rounded bg-blue-100 transition-all"
          style={{ width: `${100 - progressPercent}%` }}
        />
      </div>

      {/* Progress Text */}
      <div className="flex w-full items-center justify-between">
        <span
          className={cn(
            'text-sm font-sf-medium tracking-[-0.28px]',
            isCompleted ? 'text-green-500' : 'text-orange-600'
          )}
        >
          Raised {formatNumber(collected)}
        </span>

        <span className="text-sm font-sf-medium tracking-[-0.28px] text-blue-700">
          Needed {formatNumber(total)}
        </span>
      </div>
    </div>
  );
}
