'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, CheckCircle, Circle, Banknote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCharityPoints, getTotalDonated } from '@/utils/localStorage';
import { cn } from '@/utils/helpers/cn';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import Image from 'next/image';
import { Button } from '@/components/element/Button';

type Achievement = {
  id: number;
  title: string;
  desc: string;
  threshold: number;
  type: 'count' | 'amount';
  icon: 'trophy' | 'banknote';
};

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    setPoints(getCharityPoints());
    setTotalDonated(getTotalDonated());
  }, []);

  const achievements: Achievement[] = [
    { id: 1, title: 'First Steps', desc: 'Donate to 1 campaign', threshold: 1, type: 'count', icon: 'trophy' },
    { id: 2, title: 'Kind Heart', desc: 'Donate to 5 campaigns', threshold: 5, type: 'count', icon: 'trophy' },
    { id: 3, title: 'Generous Soul', desc: 'Donate to 10 campaigns', threshold: 10, type: 'count', icon: 'trophy' },
    { id: 4, title: 'Philanthropist', desc: 'Donate to 25 campaigns', threshold: 25, type: 'count', icon: 'trophy' },
    { id: 5, title: 'Legendary Donor', desc: 'Donate to 50 campaigns', threshold: 50, type: 'count', icon: 'trophy' },
    { id: 6, title: 'Big Donor', desc: 'Donate total Rp 100.000', threshold: 100000, type: 'amount', icon: 'banknote' },
  ];

  const getProgress = (item: Achievement) => {
    if (item.type === 'amount') {
      return totalDonated;
    }
    return points;
  };

  const isUnlocked = (item: Achievement) => {
    return getProgress(item) >= item.threshold;
  };

  const formatProgress = (item: Achievement) => {
    const current = getProgress(item);
    if (item.type === 'amount') {
      const formattedCurrent = current >= 1000 ? `${(current / 1000).toFixed(0)}k` : current;
      const formattedThreshold = item.threshold >= 1000 ? `${(item.threshold / 1000).toFixed(0)}k` : item.threshold;
      return `${formattedCurrent}/${formattedThreshold}`;
    }
    return `${current}/${item.threshold}`;
  };

  return (

    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
        <Gradient />
        <Container className="relative z-10 h-full flex flex-col px-4 pt-6">
            <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                <Button 
                  onClick={() => router.back()}
                  className="w-10 h-10 p-0 mb-4 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/80 transition shadow-sm self-start"
                  variant="secondary"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-800" />
                </Button>
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 relative mb-2">
                        <Image 
                          src="/assets/images/charity-coin.svg" 
                          alt="Charity Point" 
                          fill
                          className="object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{points}</h2>
                    <p className="text-gray-500">Total Charity Points</p>
                    {totalDonated > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        Total Donated: Rp {totalDonated.toLocaleString('id-ID')}
                      </p>
                    )}
                </div>

                <div className="space-y-4">
                    {achievements.map((item) => {
                        const unlocked = isUnlocked(item);
                        return (
                            <div 
                                key={item.id} 
                                className={cn(
                                    "p-4 rounded-2xl flex items-center gap-4 transition-all duration-300",
                                    unlocked ? "bg-white shadow-md border-l-4 border-green-500" : "bg-white/50 border border-transparent opacity-70 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                    unlocked ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                                )}>
                                    {item.icon === 'banknote' ? (
                                      <Banknote className="w-6 h-6" />
                                    ) : (
                                      <Trophy className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <div>
                                    {unlocked ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-gray-400">{formatProgress(item)}</span>
                                            <Circle className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
      </div>
    </div>
  );
}
