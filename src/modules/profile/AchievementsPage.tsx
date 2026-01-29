'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, CheckCircle, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCharityPoints } from '@/utils/localStorage';
import { cn } from '@/utils/helpers/cn';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import Image from 'next/image';
import { Button } from '@/components/element/Button';

export default function AchievementsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setPoints(getCharityPoints());
  }, []);

  const achievements = [
    { id: 1, title: 'First Steps', desc: 'Donate to 1 campaign', threshold: 1 },
    { id: 2, title: 'Kind Heart', desc: 'Donate to 5 campaigns', threshold: 5 },
    { id: 3, title: 'Generous Soul', desc: 'Donate to 10 campaigns', threshold: 10 },
    { id: 4, title: 'Philanthropist', desc: 'Donate to 25 campaigns', threshold: 25 },
    { id: 5, title: 'Legendary Donor', desc: 'Donate to 50 campaigns', threshold: 50 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-10">
      <Gradient className="-z-10" />
      
      <Container className="pt-6">
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
        </div>

        <div className="space-y-4">
            {achievements.map((item) => {
                const isUnlocked = points >= item.threshold;
                return (
                    <div 
                        key={item.id} 
                        className={cn(
                            "p-4 rounded-2xl flex items-center gap-4 transition-all duration-300",
                            isUnlocked ? "bg-white shadow-md border-l-4 border-green-500" : "bg-white/50 border border-transparent opacity-70 grayscale"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                            isUnlocked ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                        )}>
                            {isUnlocked ? <Trophy className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <div>
                            {isUnlocked ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-gray-400">{points}/{item.threshold}</span>
                                    <Circle className="w-6 h-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </Container>
    </div>
  );
}
