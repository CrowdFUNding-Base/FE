'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Boxes, Lock } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { Button } from '@/components/element/Button';

export default function NFTPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Mock NFT Data
  const mockNFTs = [
    { id: 1, name: 'Supporter Badge #1', image: 'https://placehold.co/400x400/007AFF/ffffff?text=Badge+1' },
    { id: 2, name: 'Early Adopter', image: 'https://placehold.co/400x400/FF2D55/ffffff?text=Early+Adopter' },
    { id: 3, name: 'Super Donor', image: 'https://placehold.co/400x400/5856D6/ffffff?text=Super+Donor' },
  ];

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

                <h1 className="text-2xl font-bold text-gray-900 mb-6">NFT</h1>
                {!isConnected ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
                        <p className="text-gray-500 mb-8">You need to connect your wallet to view your NFT collection.</p>
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

                        <div className="grid grid-cols-2 gap-4">
                            {mockNFTs.map(nft => (
                                <div key={nft.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition">
                                    <div className="aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
                                        {/* Use configured Image domain or just a div fallback if strict */}
                                        <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs p-2 text-center">
                                            {nft.name}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">{nft.name}</h3>
                                    <p className="text-xs text-gray-500">CrowdFUNding Collection</p>
                                </div>
                            ))}
                            {/* Add more mock items to fill grid */}
                            <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-3 flex flex-col items-center justify-center min-h-[160px] text-gray-400 gap-2">
                                <Boxes className="w-8 h-8 opacity-50" />
                                <span className="text-xs font-medium">Mint more to see here</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
      </div>
    </div>
  );
}
