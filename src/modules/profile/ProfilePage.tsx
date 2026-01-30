'use client';

import { useRouter } from 'next/navigation';
import CharityCard from '@/components/element/CharityCard';
import { getCharityPoints, getStreak } from '@/utils/localStorage';
import { useEffect, useState } from 'react';
import { Wallet, Trophy, Boxes, User, Receipt, ArrowUpRight, Lightbulb, ArrowLeft } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { Button } from '@/components/element/Button';
import { cn } from '@/utils/helpers/cn';

// ... (keep structure)

export default function ProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setPoints(getCharityPoints());
    setStreak(getStreak());
  }, []);

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
        <Gradient />
        <Container className="relative z-10 h-full flex flex-col px-4 pt-12">
          <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <Button 
                  variant="black" 
                  size="sm" 
                  leftIcon={<Lightbulb className="w-3.5 h-3.5" />} 
                  className="px-3.5"
                >
                   Tips
                </Button>
              </div>

              {/* Avatar / User Info */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-purple-400 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg relative">
                    {/* Mock Avatar */}
                    <User className="w-full h-full p-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Guest User'}
                </h2>
                <p className="text-gray-500 font-medium">Member since 31 Jan 2026</p>
                
                {/* Wallet Connect */}
                <div className="mt-4">
                     {!isConnected ? (
                        <Button 
                          onClick={openConnectModal}
                          variant="primary"
                          size="rounded"
                          leftIcon={<Wallet className="w-4 h-4" />}
                          className="shadow-md"
                        >
                          Connect Wallet
                        </Button>
                     ) : (
                        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white/50">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                           <span className="text-sm font-medium text-gray-700">
                             Connected
                           </span>
                        </div>
                     )}
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Charity Card */}
                <CharityCard 
                  collected={points} 
                  totalDays={7} 
                  variant="full" 
                  streak={streak}
                  className="w-full max-w-none shadow-xl bg-white/80 border border-white/50 backdrop-blur-sm"
                  onArrowClick={() => router.push('/profile/achievements')}
                />

                {/* Navigation Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => router.push('/profile/achievements')}
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 flex flex-col items-center gap-3 active:scale-95 transition"
                    >
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <span className="font-semibold text-gray-900">Achievements</span>
                    </button>
                    <button 
                      onClick={() => router.push('/profile/nft')}
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 flex flex-col items-center gap-3 active:scale-95 transition"
                    >
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Boxes className="w-8 h-8" />
                        </div>
                        <span className="font-semibold text-gray-900">My NFTs</span>
                    </button>
                </div>

                <button 
                  onClick={() => router.push('/history')}
                  className="w-full bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 flex items-center justify-between active:scale-95 transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Receipt className="w-8 h-8" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Transaction History</span>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition">
                       <ArrowUpRight className="w-5 h-5 text-gray-600" />
                    </div>
                </button>

              </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
