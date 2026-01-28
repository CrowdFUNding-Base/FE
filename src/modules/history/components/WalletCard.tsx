import React from 'react';
import { useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/utils/helpers/cn';

type WalletCardProps = {
  isConnected: boolean;
};

export const WalletCard = ({ isConnected }: WalletCardProps) => {
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex flex-col gap-6">
      {/* Static Wallet Card */}
      <div className="bg-cyan-100 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-neutral-400 relative overflow-hidden">
        
        <h2 className="text-lg font-sf-bold text-gray-900 mb-1 relative z-10">
          Wallet: Prify
        </h2>
        <p className="text-sm text-gray-600 mb-6 relative z-10">
          Connected at: 30 Dec 2025
        </p>

        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-sm font-sf-medium text-gray-800 mb-1">Total Donasi</p>
            <p className="text-lg font-sf-bold text-gray-900">IDR 200.000</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-sf-medium text-gray-800 mb-1">Sisa</p>
            <p className="text-lg font-sf-bold text-gray-900">IDR 100.000</p>
          </div>
        </div>
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
