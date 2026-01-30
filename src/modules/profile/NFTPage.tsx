'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Boxes, Lock, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { Button } from '@/components/element/Button';
import { useBadgesByUser, formatTimestamp } from '@/hooks/useCrowdfunding';

export default function NFTPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Fetch real badges
  const { data: badges, isLoading } = useBadgesByUser(address);

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

                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Badges</h1>
                
                {!isConnected ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
                        <p className="text-gray-500 mb-8">You need to connect your wallet to view your badge collection.</p>
                        <Button 
                            onClick={openConnectModal}
                            variant="primary"
                            size="lg"
                            className="w-full max-w-xs rounded-xl shadow-lg"
                        >
                            Connect Wallet
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center gap-3 border border-white/50">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Wallet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500">Connected as</p>
                                <p className="text-sm font-mono font-medium truncate text-gray-900">{address || '0x...'}</p>
                            </div>
                        </div>

                        {isLoading ? (
                           <div className="flex flex-col items-center justify-center py-20">
                             <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                             <p className="text-gray-500">Loading your badges...</p>
                           </div>
                        ) : badges && badges.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition group">
                                        <div className="aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
                                            {/* Badge Visual */}
                                            <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-3 text-center relative">
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                                                <Boxes className="w-8 h-8 mb-2 opacity-80" />
                                                <span className="font-bold text-xs leading-tight">{badge.name}</span>
                                                <span className="text-[10px] opacity-75 mt-1">#{badge.token_id}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">{badge.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-1">{badge.description || 'Campaign Supporter'}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                          {formatTimestamp(badge.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
                                <div className="p-4 bg-gray-100 rounded-full">
                                  <Boxes className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">No Badges Yet</h3>
                                  <p className="text-sm text-gray-500 mt-1">Donate to campaigns to earn your first badge!</p>
                                </div>
                                <Button 
                                  onClick={() => router.push('/home')}
                                  variant="secondary"
                                  size="sm"
                                  className="mt-2"
                                >
                                  Browse Campaigns
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
      </div>
    </div>
  );
}
