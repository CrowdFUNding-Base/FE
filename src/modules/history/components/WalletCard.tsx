import React from 'react';
import { useDisconnect, useAccount, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/utils/helpers/cn';
import { useDonationsByUser, formatIDRXCurrency } from '@/hooks/useCrowdfunding';
import { CONTRACTS } from '@/utils/contracts/addresses';
import { Loader2, Wallet } from 'lucide-react';

type WalletCardProps = {
  isConnected: boolean;
};

// Truncate wallet address for display
const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletCard = ({ isConnected }: WalletCardProps) => {
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  // Fetch real donations for total donated calculation
  const { data: donations, isLoading: donationsLoading } = useDonationsByUser(address);
  
  // Fetch IDRX balance from blockchain
  const { data: idrxBalance, isLoading: balanceLoading } = useBalance({
    address: address,
    token: CONTRACTS.baseSepolia.IDRX,
  });

  // Calculate total donated from all donations
  const totalDonated = React.useMemo(() => {
    if (!donations || donations.length === 0) return '0';
    const total = donations.reduce((sum: number, d: any) => {
      const amount = parseFloat(d.amount) || 0;
      return sum + amount;
    }, 0);
    // Amount is stored in smallest unit (2 decimals for IDRX)
    return (total / 100).toString();
  }, [donations]);

  const isLoading = donationsLoading || balanceLoading;

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Card */}
      <div className="bg-cyan-100 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-neutral-400 relative overflow-hidden">
        
        <h2 className="text-lg font-sf-bold text-gray-900 mb-1 relative z-10">
          <Wallet className="inline-block w-5 h-5 mr-2 mb-0.5" />
          {address ? truncateAddress(address) : 'No Wallet'}
        </h2>
        <p className="text-sm text-gray-600 mb-6 relative z-10">
          {isConnected ? 'Wallet Connected' : 'Not Connected'}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : (
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-sm font-sf-medium text-gray-800 mb-1">Total Donated</p>
              <p className="text-lg font-sf-bold text-gray-900">
                {donations && donations.length > 0 
                  ? formatIDRXCurrency(totalDonated)
                  : 'Rp 0'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-sf-medium text-gray-800 mb-1">IDRX Balance</p>
              <p className="text-lg font-sf-bold text-gray-900">
                {idrxBalance 
                  ? `Rp ${Number(idrxBalance.formatted).toLocaleString('id-ID')}`
                  : 'Rp 0'}
              </p>
            </div>
          </div>
        )}

        {/* Empty state hint */}
        {!isLoading && (!donations || donations.length === 0) && isConnected && (
          <p className="text-xs text-gray-500 mt-3 text-center italic">
            No donation history yet
          </p>
        )}
      </div>

      {/* Connect/Disconnect Wallet Button */}
      <button
          onClick={isConnected ? () => disconnect() : openConnectModal}
          className={cn(
             "w-full text-white font-sf-medium py-3.5 rounded-xl shadow-lg transition-all active:scale-95",
             isConnected 
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" 
                : "bg-[#007AFF] hover:bg-[#0056b3] shadow-blue-500/30"
          )}
      >
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet Now'}
      </button>
    </div>
  );
};
