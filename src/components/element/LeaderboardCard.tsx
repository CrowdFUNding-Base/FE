'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/helpers/cn';

type LeaderboardCardProps = {
  rank?: number;
  name: string;
  avatarUrl?: string;
  coinCount: number;
  showRank?: boolean;
  className?: string;
};

export default function LeaderboardCard({
  rank,
  name,
  avatarUrl,
  coinCount,
  showRank = false,
  className,
}: LeaderboardCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [coinError, setCoinError] = useState(false);

  // Generate a consistent color based on name for avatar fallback
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 bg-white rounded-2xl p-3 w-full max-w-[400px]',
        'shadow-[0px_2px_8px_rgba(0,0,0,0.05)]',
        'hover:shadow-[0px_4px_12px_rgba(0,0,0,0.1)]',
        'transition-shadow duration-200',
        className
      )}
    >
      {/* Rank Number */}
      {showRank && rank && (
        <span className="text-2xl font-sf-bold text-gray-400 w-8 text-center">
          {rank}
        </span>
      )}

      {/* Avatar */}
      <div
        className={cn(
          'w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0',
          (!avatarUrl || avatarError) && getAvatarColor(name)
        )}
      >
        {avatarUrl && !avatarError ? (
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="text-white font-sf-bold text-lg">
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="flex-1 text-lg font-sf-semibold text-gray-900 truncate">
        {name}
      </span>

      {/* Coin Badge */}
      <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1.5 rounded-full">
        <div
          className={cn(
            'w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0',
            coinError && 'bg-linear-to-br from-yellow-400 to-yellow-600'
          )}
        >
          {!coinError ? (
            <Image
              src="/assets/images/charity-coin.svg"
              alt="Charity Coin"
              width={24}
              height={24}
              className="w-full h-full object-cover"
              onError={() => setCoinError(true)}
            />
          ) : (
            <span className="text-yellow-900 text-xs">★</span>
          )}
        </div>
        <span className="text-base font-sf-semibold text-gray-800">
          {coinCount}
        </span>
      </div>
    </div>
  );
}

// Variant with different styling for list items
type LeaderboardListItemProps = LeaderboardCardProps & {
  isHighlighted?: boolean;
};

export function LeaderboardListItem({
  rank,
  name,
  avatarUrl,
  coinCount,
  showRank = true,
  isHighlighted = false,
  className,
}: LeaderboardListItemProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [coinError, setCoinError] = useState(false);

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-2 px-3 w-full',
        isHighlighted && 'bg-blue-50 rounded-xl',
        className
      )}
    >
      {/* Rank Number */}
      {showRank && rank && (
        <span className={cn(
          'text-xl font-sf-bold w-6 text-center',
          rank <= 3 ? 'text-yellow-600' : 'text-gray-400'
        )}>
          {rank}
        </span>
      )}

      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0',
          (!avatarUrl || avatarError) && getAvatarColor(name)
        )}
      >
        {avatarUrl && !avatarError ? (
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="text-white font-sf-bold text-sm">
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="flex-1 text-base font-sf-medium text-gray-900 truncate">
        {name}
      </span>

      {/* Coin Badge */}
      <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-full">
        <div
          className={cn(
            'w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0',
            coinError && 'bg-linear-to-br from-yellow-400 to-yellow-600'
          )}
        >
          {!coinError ? (
            <Image
              src="/assets/images/charity-coin.svg"
              alt="Charity Coin"
              width={20}
              height={20}
              className="w-full h-full object-cover"
              onError={() => setCoinError(true)}
            />
          ) : (
            <span className="text-yellow-900 text-xs">★</span>
          )}
        </div>
        <span className="text-sm font-sf-semibold text-gray-800">
          {coinCount}
        </span>
      </div>
    </div>
  );
}
