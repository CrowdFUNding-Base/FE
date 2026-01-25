'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/helpers/cn';
import { ArrowUpRight, Flame, Star } from 'lucide-react';

type CharityCoinProps = {
  index: number;
  isCollected: boolean;
  size?: 'sm' | 'md';
};

function CharityCoin({ index, isCollected, size = 'md' }: CharityCoinProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8.5 h-8.5',
  };

  const fallbackBg = isCollected 
    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
    : 'bg-gray-200 border-2 border-gray-300';

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden',
          sizeClasses[size],
          imageError && fallbackBg
        )}
      >
        {!imageError && isCollected ? (
          <Image
            src="/assets/images/charity-coin.svg"
            alt="Charity Coin"
            width={size === 'md' ? 48 : 40}
            height={size === 'md' ? 48 : 40}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={cn(
            'w-full h-full rounded-full flex items-center justify-center',
            fallbackBg
          )}>
            {isCollected && (
              <span className="text-yellow-900 text-lg">★</span>
            )}
          </div>
        )}
      </div>
      <span className={cn(
        'text-sm font-sf-semibold text-black'
      )}>
        {index}
      </span>
    </div>
  );
}

type CharityCardVariant = 'full' | 'compact';

type CharityCardProps = {
  collected: number;
  streak?: number;
  totalDays?: number;
  variant?: CharityCardVariant;
  className?: string;
  onArrowClick?: () => void;
};

export default function CharityCard({
  collected = 0,
  streak,
  totalDays = 7,
  variant = 'full',
  className,
  onArrowClick,
}: CharityCardProps) {
  const collectedDays = Array.from({ length: totalDays }, (_, i) => i + 1 <= collected);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'bg-yellow-100 rounded-[20px] p-5 w-full max-w-120',
          'shadow-[0px_4px_12px_rgba(0,0,0,0.05)]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-sf-bold text-gray-900">Charity Coins</h3>
          <button
            onClick={onArrowClick}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowUpRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Collected Badge */}
        <div className="flex justify-center mb-5">
          <div className="bg-[#F5D98E] px-6 py-2.5 rounded-full flex items-center gap-2">
            <span className="text-yellow-600 text-lg">★</span>
            <span className="text-lg font-sf-semibold text-gray-800">
              {collected} Collected
            </span>
          </div>
        </div>

        {/* Coins Row */}
        <div 
          ref={scrollContainerRef}
          className={cn(
            "flex items-center gap-4 px-2 overflow-x-auto scrollbar-hide select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {collectedDays.map((isCollected, index) => (
            <CharityCoin
              key={index}
              index={index + 1}
              isCollected={isCollected}
              size="md"
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        'bg-yellow-100 flex flex-col gap-3.5 rounded-3xl p-4 w-full max-w-120',
        'shadow-[0px_4px_12px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <div className='flex flex-col gap-2'>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-sf-regular text-black">Charity Coins</h3>
        <button
          onClick={onArrowClick}
          className="hover:bg-black/5 transition-colors"
        >
          <ArrowUpRight className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Badges Row */}
      <div className="flex items-center justify-between gap-3 ">
        <div className="bg-yellow-300 w-1/2 py-0.75 rounded-full flex items-center justify-center gap-2">
          <Star className="text-yellow-50"/>
          <span className="text-lg font-sf-semibold text-[#8c4804]">
            {collected} Collected
          </span>
        </div>
        {streak !== undefined && (
          <div className="bg-yellow-300 w-1/2 py-0.75 rounded-full flex items-center justify-center gap-2">
            <Flame className=" text-red-500" />
            <span className="text-lg font-sf-semibold text-[#8c4804]">
              {streak} Streak
            </span>
          </div>
        )}
      </div>
      </div>

      {/* Coins Row */}
      <div 
        ref={scrollContainerRef}
        className={cn(
          "flex items-center gap-4 px-2 overflow-x-auto scrollbar-hide select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {collectedDays.map((isCollected, index) => (
          <CharityCoin
            key={index}
            index={index + 1}
            isCollected={isCollected}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}

// Simple coin display component for use elsewhere
type CoinDisplayProps = {
  count: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

export function CoinDisplay({ count, showLabel = true, size = 'sm', className }: CoinDisplayProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8.5 h-8.5',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden',
          sizeClasses[size],
          imageError && 'bg-linear-to-br from-yellow-400 to-yellow-600'
        )}
      >
        {!imageError ? (
          <Image
            src="/assets/images/charity-coin.svg"
            alt="Charity Coin"
            width={size === 'md' ? 34 : 24}
            height={size === 'md' ? 34 : 24}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-yellow-900 text-sm">★</span>
        )}
      </div>
      {showLabel && (
        <span className="text-lg font-sf-semibold text-gray-800">{count}</span>
      )}
    </div>
  );
}
