'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Receipt } from 'lucide-react'; 
import { useAccount } from 'wagmi';
import { WalletCard } from './components/WalletCard';
import { TRANSACTIONS } from './data';
import Container from '@/components/layout/container';
import Gradient from '@/components/element/Gradient';
import { cn } from '@/utils/helpers/cn';

export default function History() {
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <Gradient />
      <Container className="relative z-10 h-full flex flex-col px-4 pt-12 max-w-lg mx-auto">
        {/* Fixed Section */}
        <div className="flex-none">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-black border border-white/50 hover:bg-white/40 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center text-lg font-sf-bold text-gray-900 mr-11">
              Wallet
            </h1>
          </div>

          <div className="mb-8">
            <WalletCard isConnected={isConnected} />
          </div>
        </div>
        
         {/* Scrollable Transaction History */}
         <div className="flex-1 overflow-y-auto pb-8 -mx-4 px-4 scrollbar-hide">
            <h3 className="font-sf-bold text-lg text-gray-900 mb-4 sticky top-0 bg-[#FAFAFA]/0 backdrop-blur-sm py-2">Today</h3>
            <div className="space-y-3 mb-6">
                {TRANSACTIONS.today.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <span className="font-sf-medium text-gray-700">{tx.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="bg-cyan-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-cyan-700">
                                <Wallet className="w-3.5 h-3.5" />
                                <span className="font-sf-bold text-sm">{tx.amount}</span>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            <h3 className="font-sf-bold text-lg text-gray-900 mb-4 sticky top-0 bg-[#FAFAFA]/0 backdrop-blur-sm py-2">Yesterday</h3>
             <div className="space-y-3 mb-6">
                {TRANSACTIONS.yesterday.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <span className="font-sf-medium text-gray-700">{tx.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             {tx.amount === '50.000' ? (
                                  <div className="bg-cyan-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-cyan-700">
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span className="font-sf-bold text-sm">{tx.amount}</span>
                                 </div>
                             ) : (
                                 <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-gray-600">
                                    <span className="font-sf-bold text-sm">{tx.amount}</span>
                                 </div>
                             )}
                        
                         </div>
                    </div>
                ))}
            </div>

            <h3 className="font-sf-bold text-lg text-gray-900 mb-4 sticky top-0 bg-[#FAFAFA]/0 backdrop-blur-sm py-2">Sunday, 20 January 2026</h3>
            <div className="space-y-3 mb-8">
                {TRANSACTIONS.older.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <span className="font-sf-medium text-gray-700">{tx.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-gray-600">
                                <span className="font-sf-bold text-sm">{tx.amount}</span>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
         </div>
      </Container>
    </main>
  );
}
