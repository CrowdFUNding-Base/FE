'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, Loader2, AlertCircle, XCircle, Building2, CreditCard } from 'lucide-react';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';
import { Button } from '@/components/element/Button';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useCampaign, formatIDRX, formatIDRXCurrency, formatIDR } from '@/hooks/useCrowdfunding';
import api from '@/utils/api/axios'; // Ensure we use the configured axios instance

interface WithdrawPageProps {
  campaignId: string;
}

type WithdrawMethod = 'CRYPTO' | 'BANK';

export default function WithdrawPage({ campaignId }: WithdrawPageProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  
  const [method, setMethod] = useState<WithdrawMethod>('CRYPTO');
  const [amount, setAmount] = useState<number | ''>('');
  
  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  // Fiat Withdrawal State
  const [fiatStatus, setFiatStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [fiatError, setFiatError] = useState('');

  // Fetch campaign data
  const { data: campaignData, isLoading: campaignLoading } = useCampaign(Number(campaignId));
  const campaign = campaignData?.campaign;

  // Check if current user is the owner
  const isOwner = isConnected && campaign && address?.toLowerCase() === campaign.owner?.toLowerCase();

  // Calculate balance (using camelCase from API)
  const vaultBalance = campaign ? formatIDRX(campaign.balance) : 0;

  // Crypto Withdraw hook
  const { withdraw, status: cryptoStatus, txHash, error: cryptoError, reset: resetCrypto } = useWithdraw();

  const handleCryptoWithdraw = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > vaultBalance) {
      alert('Insufficient funds');
      return;
    }
    await withdraw(Number(campaignId), amount);
  };

  const handleFiatWithdraw = async () => {
    if (!amount || amount <= 0 || !bankName || !accountNumber || !accountHolder) {
      alert('Please fill in all fields');
      return;
    }
    if (amount > vaultBalance) {
      alert('Insufficient funds');
      return;
    }

    try {
      setFiatStatus('processing');
      // Call Mock API
      await api.post('/vault/withdraw-mock', {
        campaignId: Number(campaignId),
        amount,
        bankName,
        accountNumber,
        accountHolder
      });
      setFiatStatus('success');
    } catch (err: any) {
      console.error(err);
      setFiatStatus('error');
      setFiatError(err.response?.data?.message || 'Failed to process withdrawal');
    }
  };

  const handleReset = () => {
    if (method === 'CRYPTO') resetCrypto();
    else {
      setFiatStatus('idle');
      setFiatError('');
    }
  };

  // Status checks
  const isSuccess = cryptoStatus === 'success' || fiatStatus === 'success';
  const isError = cryptoStatus === 'error' || fiatStatus === 'error';
  const errorMessage = cryptoError?.message || fiatError;
  const isProcessing = cryptoStatus === 'pending' || cryptoStatus === 'confirming' || fiatStatus === 'processing';

  // Success state UI
  if (isSuccess) {
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Success!</h2>
                <p className="text-gray-600">
                  {formatIDR(Number(amount))} has been {method === 'CRYPTO' ? 'transferred to your wallet' : 'sent to your bank account'}.
                </p>
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

  // Error state UI
  if (isError) {
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Failed</h2>
                <p className="text-gray-600 text-sm">{errorMessage || 'Something went wrong'}</p>
              </div>
              <Button
                onClick={handleReset}
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
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Funds</h1>

            {/* Not Connected */}
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
            ) : campaignLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                <p className="text-gray-600 mt-4">Loading campaign...</p>
              </div>
            ) : !isOwner ? (
              // Not Owner UI
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500">
                  You do not have permission to withdraw funds from this campaign. Only the campaign owner can perform this action.
                </p>
                <Button
                  onClick={() => router.push(`/campaign/${campaignId}`)}
                  variant="primary"
                  size="md"
                  className="mt-6"
                >
                  Back to Campaign
                </Button>
              </div>
            ) : (
              // Owner - Withdraw Form
              <>
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500">Connected Wallet</p>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 rounded-full text-xs font-semibold text-green-700">
                    Owner
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-6 border border-white/50">
                  {/* Balance Display */}
                  <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatIDRXCurrency(campaign?.balance || '0')}
                    </p>
                  </div>

                  {/* Method Tabs */}
                  <div className="flex p-1 bg-gray-100/50 rounded-xl">
                    <button
                      onClick={() => setMethod('CRYPTO')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                        method === 'CRYPTO' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Wallet className="w-4 h-4" /> Crypto Content
                    </button>
                    <button
                      onClick={() => setMethod('BANK')}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                        method === 'BANK' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Building2 className="w-4 h-4" /> Bank Account
                    </button>
                  </div>

                  {/* Common Amount Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Withdraw Amount (IDRX)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="0"
                        disabled={isProcessing}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition border border-gray-200 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <button 
                        onClick={() => setAmount(vaultBalance)}
                        disabled={isProcessing}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
                      >
                        Max Amount
                      </button>
                    </div>
                  </div>

                  {/* Bank Details Form */}
                  {method === 'BANK' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                        <select 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          disabled={isProcessing}
                        >
                          <option value="">Select Bank</option>
                          <option value="BCA">BCA</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="BNI">BNI</option>
                          <option value="BRI">BRI</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                        <input 
                          type="text" 
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. 1234567890"
                          className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          disabled={isProcessing}
                        />
                      </div>
                       <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                        <input 
                          type="text" 
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="Must match account owner"
                          className="w-full px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={method === 'CRYPTO' ? handleCryptoWithdraw : handleFiatWithdraw}
                    disabled={isProcessing || vaultBalance <= 0 || !amount || amount <= 0 || amount > vaultBalance}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg bg-red-600 hover:bg-red-700"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {method === 'CRYPTO' 
                          ? (cryptoStatus === 'pending' ? 'Confirm in wallet...' : 'Confirming...')
                          : 'Processing Payout...'
                        }
                      </span>
                    ) : (
                      method === 'CRYPTO' ? 'Withdraw to Wallet' : 'Request Payout'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
