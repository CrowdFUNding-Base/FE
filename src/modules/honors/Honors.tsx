'use client';

import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import Container from '@/components/layout/container';
import { Button, LeaderboardCard } from '@/components';
import { cn } from '@/utils/helpers/cn';

// Mock data for leaderboard
const mockLeaderboardData = [
  { id: 1, name: 'John Doe', avatarUrl: '/assets/images/avatar-1.png', coinCount: 20 },
  { id: 2, name: 'Jane Smith', avatarUrl: '/assets/images/avatar-2.png', coinCount: 18 },
  { id: 3, name: 'Alex Johnson', avatarUrl: '/assets/images/avatar-3.png', coinCount: 20 },
  { id: 4, name: 'Maria Garcia', avatarUrl: '/assets/images/avatar-4.png', coinCount: 15 },
  { id: 5, name: 'David Brown', avatarUrl: '/assets/images/avatar-5.png', coinCount: 20 },
  { id: 6, name: 'Sarah Wilson', avatarUrl: '/assets/images/avatar-6.png', coinCount: 12 },
  { id: 7, name: 'Michael Lee', avatarUrl: '/assets/images/avatar-7.png', coinCount: 11 },
  { id: 8, name: 'Emily Davis', avatarUrl: '/assets/images/avatar-8.png', coinCount: 10 },
  { id: 9, name: 'Chris Taylor', avatarUrl: '/assets/images/avatar-9.png', coinCount: 9 },
  { id: 10, name: 'Lisa Anderson', avatarUrl: '/assets/images/avatar-10.png', coinCount: 8 },
];

// Mock data for honor cards
const honorCards = [
  { id: 1, color: 'bg-purple-200', label: 'Achievement 1' },
  { id: 2, color: 'bg-yellow-100', label: 'Achievement 2' },
  { id: 3, color: 'bg-cyan-100', label: 'Achievement 3' },
  { id: 4, color: 'bg-pink-100', label: 'Achievement 4' },
  { id: 5, color: 'bg-green-100', label: 'Achievement 5' },
];

export default function Honors() {
  // Sort by highest points
  const sortedLeaderboard = useMemo(() => {
    return [...mockLeaderboardData].sort((a, b) => b.coinCount - a.coinCount);
  }, []);

  const handleTipsClick = () => {
    // TODO: Implement tips modal or something ?,
    console.log('Tips clicked');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-100 via-cyan-50 to-blue-100" />
        
        {/* Blur circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-cyan-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-10 w-60 h-60 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
      </div>

      <Container className="pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-sf-bold text-gray-900">Honors</h1>
          <Button
            variant="black"
            size="sm"
            leftIcon={<Lightbulb className="w-3.5 h-3.5" />}
            onClick={handleTipsClick}
            className="px-3.5"
          >
            Tips
          </Button>
        </div>

        {/* Honor Cards */}
        <div className="relative -mx-8 px-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {honorCards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  'shrink-0 w-24 h-32 rounded-2xl snap-start',
                  'shadow-[0px_4px_16px_rgba(0,0,0,0.08)]',
                  'hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)]',
                  'transition-all duration-200 cursor-pointer',
                  'active:scale-95',
                  card.color
                )}
                aria-label={card.label}
              />
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-sf-bold text-gray-900">Leaderboard</h2>

          {/* Leaderboard List */}
          <div className="flex flex-col gap-2 max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-hide">
            {sortedLeaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center gap-3">
                <span className="text-xl font-sf-bold text-gray-400 w-6 text-center shrink-0">
                  {index + 1}
                </span>
                <LeaderboardCard
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  coinCount={user.coinCount}
                  showRank={false}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
