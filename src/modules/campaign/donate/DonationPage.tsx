'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveDonation } from '@/utils/localStorage';
import { useAccount, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';
import { Button } from '@/components/element/Button';
import { useDonate } from '@/hooks/useDonate';
import { useCampaign, formatIDRXCurrency, formatIDR } from '@/hooks/useCrowdfunding';
import { ERC20_ABI } from '@/utils/abi/erc20';
import { CONTRACTS, TOKEN_DECIMALS } from '@/utils/contracts/addresses';
import { formatUnits } from 'viem';

interface DonationPageProps {
  campaignId: string;
}

type Currency = 'IDRX' | 'USDC';

export default function DonationPage({ campaignId }: DonationPageProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  
  const [amount, setAmount] = useState<number | ''>('');
  const [currency, setCurrency] = useState<Currency>('IDRX');

  // Fetch campaign data
  const { data: campaignData, isLoading: campaignLoading } = useCampaign(Number(campaignId));
  const campaign = campaignData?.campaign;

  // Selected Token Params
  const tokenAddress = CONTRACTS.baseSepolia[currency];
  const tokenDecimals = TOKEN_DECIMALS[currency];

  // Donate hook (Dynamic based on selected currency)
  const { donate, status, txHash, error, reset } = useDonate(tokenAddress, tokenDecimals);

  // Get Wallet Balance for selected token
  const { data: balanceData } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const formattedBalance = balanceData 
    ? Number(formatUnits(balanceData as bigint, tokenDecimals))
    : 0;

  // Track if we've saved the donation for this transaction
  const hasSavedDonation = useRef(false);

  // Save donation to localStorage when status becomes success
  useEffect(() => {
    if (status === 'success' && amount && !hasSavedDonation.current) {
      saveDonation(Number(amount), campaignId);
      hasSavedDonation.current = true;
    }
    // Reset flag when status changes away from success
    if (status !== 'success') {
      hasSavedDonation.current = false;
    }
  }, [status, amount, campaignId]);

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > formattedBalance) {
      alert(`Insufficient ${currency} balance`);
      return;
    }

    await donate(Number(campaignId), amount);
  };

  // Helper to format display amount based on currency
  const formatDisplayAmount = (val: number) => {
    if (currency === 'IDRX') return formatIDR(val);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen w-full bg-white flex justify-center">
        <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
          <Gradient />
          <Container className="relative z-10 h-full flex flex-col items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6 max-w-sm w-full animate-in fade-in zoom-in duration-500 border border-white/50">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
               <p className="text-gray-600">Your donation of {formatDisplayAmount(Number(amount))} has been received!</p>
              </div>
              {txHash && (
                <a 
                  href={`https://sepolia.basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 underline text-sm"
                >
                  View on BaseScan →
                </a>
              )}
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

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen w-full bg-white flex justify-center">
        <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
          <Gradient />
          <Container className="relative z-10 h-full flex flex-col items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6 max-w-sm w-full animate-in fade-in zoom-in duration-500 border border-white/50">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Failed</h2>
                <p className="text-gray-600 text-sm">{error?.message || 'Something went wrong'}</p>
              </div>
              <Button
                onClick={reset}
                variant="primary"
                size="lg"
                className="w-full rounded-xl shadow-lg"
              >
                Try Again
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  const isProcessing = status === 'approving' || status === 'donating' || status === 'confirming';

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
              disabled={isProcessing}
            >
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </Button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate to Campaign</h1>
            {campaign && (
              <p className="text-gray-600 mb-6">{campaign.name}</p>
            )}
            
            {/* Wallet Connect */}
            {!isConnected ? (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Connect wallet to donate</span>
                </div>
                <Button 
                  onClick={openConnectModal}
                  variant="wallet"
                  size="sm"
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  Connect
                </Button>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex flex-col gap-2 border border-white/50 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Your {currency} Balance</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currency === 'IDRX' 
                      ? formatIDRXCurrency(formattedBalance * 100) // formatIDRX expects cents
                      : `${formattedBalance.toLocaleString()} USDC`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Donation Form */}
            {isConnected && (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-6 border border-white/50 mt-4">
                
                {/* Currency Tabs */}
                <div className="flex p-1 bg-gray-100/50 rounded-xl">
                  {['IDRX', 'USDC'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c as Currency);
                        setAmount('');
                      }}
                      disabled={isProcessing}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                        currency === c 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Amount ({currency})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      {currency === 'IDRX' ? 'Rp' : '$'}
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder={currency === 'IDRX' ? "10000" : "10"}
                      disabled={isProcessing}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                    />
                  </div>
                  
                  {currency === 'IDRX' && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                      {[1000, 5000, 10000, 50000].map((val) => (
                        <Button
                          key={val}
                          onClick={() => setAmount(val)}
                          variant={amount === val ? 'primary' : 'rounded'}
                          size="rounded"
                          disabled={isProcessing}
                          className={cn(
                            "whitespace-nowrap",
                            amount !== val && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {val.toLocaleString('id-ID')}
                        </Button>
                      ))}
                    </div>
                  )}

                  {currency === 'USDC' && (
                     <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                     {[5, 10, 25, 50].map((val) => (
                       <Button
                         key={val}
                         onClick={() => setAmount(val)}
                         variant={amount === val ? 'primary' : 'rounded'}
                         size="rounded"
                         disabled={isProcessing}
                         className={cn(
                           "whitespace-nowrap",
                           amount !== val && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                         )}
                       >
                         ${val}
                       </Button>
                     ))}
                   </div>
                  )}
                </div>

                  <Button
                    onClick={handleDonate}
                    disabled={isProcessing || !amount || amount <= 0}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {status === 'approving' && `Approving ${currency}...`}
                        {status === 'donating' && 'Confirm in wallet...'}
                        {status === 'confirming' && 'Confirming...'}
                      </span>
                    ) : (
                      'Donate Now'
                    )}
                  </Button>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
