'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';
import { getVaultBalance, withdrawFunds } from '@/utils/localStorage';
import { Button } from '@/components/element/Button';

interface WithdrawPageProps {
  campaignId: string;
}

export default function WithdrawPage({ campaignId }: WithdrawPageProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(0);

  // Mock checking if user is the owner
  const isOwner = isConnected && campaignId === '1';

  // If connected but not owner (i.e. not campaign 1)
  const isNotOwner = isConnected && campaignId !== '1';

  useEffect(() => {
    setVaultBalance(getVaultBalance());
  }, []);

  const handleWithdraw = () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > vaultBalance) {
      alert('Insufficient funds');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const success = withdrawFunds(Number(amount));
      if (success) {
        setWithdrawSuccess(true);
        setVaultBalance(prev => prev - Number(amount));
      } else {
        alert('Withdrawal failed');
      }
      setIsProcessing(false);
    }, 2000);
  };

  if (withdrawSuccess) {
    return (
      <div className="min-h-screen w-full bg-white flex justify-center">
        <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
            <Gradient />
            <Container className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6 max-w-sm w-full animate-in fade-in zoom-in duration-500 border border-white/50">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Success!</h2>
                    <p className="text-gray-600">Funds have been transferred to your wallet.</p>
                </div>
                <Button
                    onClick={() => router.push(`/campaign/${campaignId}`)}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg"
                >
                    Back to Campaign
                </Button>
                </div>
            </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
        <Gradient />
        <Container className="relative z-10 h-full flex flex-col px-4 pt-6">
        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
            <Button 
            onClick={() => router.back()}
            className="w-10 h-10 p-0 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/80 transition shadow-sm mb-4 self-start"
            variant="secondary"
            >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Funds</h1>

            {/* Helper / Wallet Connect */}
            {!isConnected ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Wallet className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
                <p className="text-gray-500 mb-6">You must connect your wallet to verify ownership and withdraw funds.</p>
                <Button 
                    onClick={openConnectModal}
                    variant="primary"
                    size="lg"
                    className="w-full max-w-xs shadow-lg"
                    leftIcon={<Wallet className="w-5 h-5" />}
                >
                    Connect Wallet
                </Button>
            </div>
            ) : (
             <>
             {/* Owner Check Mock - In real app, check functionality here */}
             <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-gray-500">Connected Wallet</p>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {address}
                        </p>
                    </div>
                 </div>
                 <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                     Owner
                 </div>
             </div>

            {/* Withdrawal Form */}
            {isNotOwner ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-red-600 rotate-45" /> {/* X icon workaround or just checkcircle rotating */}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                     <p className="text-gray-500">
                        You do not have permission to withdraw funds from this campaign. Only the campaign owner can perform this action.
                    </p>
                    <p className="text-xs text-gray-400 mt-4">(Mock: Try Campaign "Bantu Korban Banjir Bandang" / ID: 1)</p>
                </div>
            ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-6 border border-white/50">
                
                {/* Balance Display */}
                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                        Rp {vaultBalance.toLocaleString('id-ID')}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Withdraw Amount (IDR)</label>
                    <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition border border-gray-200"
                    />
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                       <button 
                         onClick={() => setAmount(vaultBalance)}
                         className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                       >
                         Max Amount
                       </button>
                    </div>
                </div>

                <Button
                    onClick={handleWithdraw}
                    disabled={isProcessing || vaultBalance <= 0 || (typeof amount === 'number' && amount > vaultBalance)}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg bg-red-600 hover:bg-red-700"
                    leftIcon={isProcessing ? <Loader2 className="animate-spin" /> : undefined}
                >
                    {isProcessing ? 'Processing...' : 'Withdraw Funds'}
                </Button>
            </div>
            )}
            </>
            )}

        </div>
        </Container>
      </div>
    </div>
  );
}
