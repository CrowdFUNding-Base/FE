'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Loader2, Receipt, ExternalLink } from 'lucide-react'; 
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { WalletCard } from './components/WalletCard';
import Container from '@/components/layout/container';
import Gradient from '@/components/element/Gradient';
import { Button } from '@/components/element/Button';
import { useDonationsByUser, formatIDRXCurrency, formatTimestamp } from '@/hooks/useCrowdfunding';

// Group donations by date
function groupByDate(donations: any[]) {
  const groups: Record<string, any[]> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  donations.forEach((donation) => {
    const date = formatTimestamp(donation.timestamp);
    date.setHours(0, 0, 0, 0);

    let label: string;
    if (date.getTime() === today.getTime()) {
      label = 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(donation);
  });

  return groups;
}

export default function History() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Fetch real donations
  const { data: donations, isLoading } = useDonationsByUser(address);
  const groupedDonations = donations ? groupByDate(donations) : {};
  const sortedLabels = Object.keys(groupedDonations).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return 0; // Keep other dates in order
  });

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <Gradient />
      <Container className="relative z-10 h-full flex flex-col px-4 pt-12 max-w-lg mx-auto">
        {/* Header Section */}
        <div className="flex-none pt-6">
          <Button 
            onClick={() => router.push('/profile')}
            className="w-10 h-10 p-0 mb-4 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/80 transition shadow-sm self-start"
            variant="secondary"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

          <div className="mb-8">
            <WalletCard isConnected={isConnected} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-8 -mx-4 px-4 scrollbar-hide">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-500 text-sm mb-4">Connect your wallet to view your donation history.</p>
              <Button onClick={openConnectModal} variant="primary" size="md">
                Connect Wallet
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-2" />
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : donations && donations.length > 0 ? (
            <>
              {sortedLabels.map((label) => (
                <div key={label} className="mb-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 sticky top-0 bg-[#FAFAFA]/80 backdrop-blur-sm py-2">
                    {label}
                  </h3>
                  <div className="space-y-3">
                    {groupedDonations[label].map((tx: any) => (
                      <div 
                        key={tx.id || tx.transaction_hash} 
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
                      >
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className="font-medium text-gray-900 truncate">
                            {tx.campaign_name || `Campaign #${tx.campaign_id}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-cyan-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-cyan-700">
                            <Wallet className="w-3.5 h-3.5" />
                            <span className="font-bold text-sm">{formatIDRXCurrency(tx.amount)}</span>
                          </div>
                          {tx.transaction_hash && (
                            <a 
                              href={`https://sepolia.basescan.org/tx/${tx.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500 text-sm mb-4">Your donation history will appear here.</p>
              <Button onClick={() => router.push('/home')} variant="secondary" size="sm">
                Browse Campaigns
              </Button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
