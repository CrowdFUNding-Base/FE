'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Loader2, Trophy, Users } from 'lucide-react';
import Container from '@/components/layout/container';
import { Button, LeaderboardCard } from '@/components';
import { cn } from '@/utils/helpers/cn';
import api from '@/utils/api/axios';

// Leaderboard entry type
interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  name: string;
  charityPoints: number;
  streak: number;
  totalDonated: string;
}

// Honor cards (static for now)
const honorCards = [
  { id: 1, color: 'bg-purple-200', label: 'Achievement 1' },
  { id: 2, color: 'bg-yellow-100', label: 'Achievement 2' },
  { id: 3, color: 'bg-cyan-100', label: 'Achievement 3' },
  { id: 4, color: 'bg-pink-100', label: 'Achievement 4' },
  { id: 5, color: 'bg-green-100', label: 'Achievement 5' },
];

export default function Honors() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Fetch leaderboard from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/crowdfunding/leaderboard?limit=20');
        if (response.data.success) {
          setLeaderboard(response.data.data);
          setIsEmpty(response.data.meta?.isEmpty || response.data.data.length === 0);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboard([]);
        setIsEmpty(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleTipsClick = () => {
    console.log('Tips clicked');
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-lg bg-white relative h-screen overflow-hidden flex flex-col shadow-2xl">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-[#FAFAFA]">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-blue-100 via-cyan-50 to-blue-100" />
            
            {/* Blur circles */}
            <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl" />
            <div className="absolute top-40 right-0 w-80 h-80 bg-cyan-200/50 rounded-full blur-3xl" />
            <div className="absolute bottom-40 -left-10 w-60 h-60 bg-blue-200/40 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-100/40 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
        </div>

        <Container className="h-full flex flex-col pt-6 px-4">
            <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
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
                <div className="relative -mx-4 px-4 mb-8">
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
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-sf-bold text-gray-900">Leaderboard</h2>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-3" />
                    <p className="text-gray-500">Loading leaderboard...</p>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && isEmpty && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No Data Yet</h3>
                    <p className="text-gray-500 text-sm">
                      Be the first to donate and get on the leaderboard!
                    </p>
                  </div>
                )}

                {/* Leaderboard List */}
                {!isLoading && !isEmpty && (
                  <div className="flex flex-col gap-2">
                      {leaderboard.map((user) => (
                      <div key={user.walletAddress} className="flex items-center gap-3">
                          <span className="text-xl font-sf-bold text-gray-400 w-6 text-center shrink-0">
                          {user.rank}
                          </span>
                          <LeaderboardCard
                          name={user.name}
                          avatarUrl={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`}
                          coinCount={user.charityPoints}
                          showRank={false}
                          className="flex-1"
                          />
                      </div>
                      ))}
                  </div>
                )}
                </div>
            </div>
        </Container>
      </div>
    </div>
  );
}
