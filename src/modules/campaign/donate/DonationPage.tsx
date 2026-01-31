'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveDonation } from '@/utils/localStorage';
import { useAccount, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, CheckCircle, Loader2, AlertCircle, QrCode, CreditCard } from 'lucide-react';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';
import { Button } from '@/components/element/Button';
import { useDonate } from '@/hooks/useDonate';
import { useCampaign, formatIDRXCurrency, formatIDR } from '@/hooks/useCrowdfunding';
import { ERC20_ABI } from '@/utils/abi/erc20';
import { CONTRACTS, TOKEN_DECIMALS } from '@/utils/contracts/addresses';
import { formatUnits } from 'viem';
import api from '@/utils/api/axios';

interface DonationPageProps {
  campaignId: string;
}

type PaymentMethod = 'QRIS' | 'IDRX' | 'USDC';

export default function DonationPage({ campaignId }: DonationPageProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS'); // Default to QRIS

  // QRIS states
  const [qrisLoading, setQrisLoading] = useState(false);
  const [qrisRedirectUrl, setQrisRedirectUrl] = useState<string | null>(null);
  const [qrisOrderId, setQrisOrderId] = useState<string | null>(null);
  const [qrisStatus, setQrisStatus] = useState<'idle' | 'pending' | 'checking' | 'success' | 'error'>('idle');
  const [qrisTxHash, setQrisTxHash] = useState<string | null>(null);

  // Fetch campaign data
  const { data: campaignData, isLoading: campaignLoading } = useCampaign(Number(campaignId));
  const campaign = campaignData?.campaign;

  // For Crypto payments (IDRX/USDC)
  const isCrypto = paymentMethod === 'IDRX' || paymentMethod === 'USDC';
  const tokenAddress = isCrypto ? CONTRACTS.baseSepolia[paymentMethod] : undefined;
  const tokenDecimals = isCrypto ? TOKEN_DECIMALS[paymentMethod] : 2;

  // Donate hook (for crypto)
  const { donate, status: cryptoStatus, txHash: cryptoTxHash, error: cryptoError, reset: cryptoReset } = useDonate(
    tokenAddress || CONTRACTS.baseSepolia.IDRX, 
    tokenDecimals
  );

  // Get Wallet Balance for selected token (only for crypto)
  const { data: balanceData } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const formattedBalance = balanceData 
    ? Number(formatUnits(balanceData as bigint, tokenDecimals))
    : 0;

  const hasSavedDonation = useRef(false);

  // Save donation to localStorage when crypto status becomes success
  useEffect(() => {
    if (cryptoStatus === 'success' && amount && !hasSavedDonation.current) {
      saveDonation(Number(amount), campaignId);
      hasSavedDonation.current = true;
    }
    if (cryptoStatus !== 'success') {
      hasSavedDonation.current = false;
    }
  }, [cryptoStatus, amount, campaignId]);

  // Poll QRIS status when waiting
  useEffect(() => {
    if (qrisStatus !== 'pending' || !qrisOrderId) return;

    const pollInterval = setInterval(async () => {
      try {
        setQrisStatus('checking');
        const response = await api.post(`/crowdfunding/contribution/qris-status/${qrisOrderId}`);
        
        if (response.data.success) {
          setQrisStatus('success');
          setQrisTxHash(response.data.data.donation?.donateTxHash);
          saveDonation(Number(amount), campaignId);
          clearInterval(pollInterval);
        } else if (response.data.status === 'expire' || response.data.status === 'cancel') {
          setQrisStatus('error');
          clearInterval(pollInterval);
        } else {
          // Still pending, continue polling
          setQrisStatus('pending');
        }
      } catch (error) {
        console.error('Error checking QRIS status:', error);
        setQrisStatus('pending'); // Continue polling on error
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [qrisStatus, qrisOrderId, amount, campaignId]);

  const handleQrisDonate = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setQrisLoading(true);
    try {
      const response = await api.post('/crowdfunding/contribution/qris', {
        campaign_id: Number(campaignId),
        amount: Number(amount),
        customer_details: {
          first_name: 'Donatur',
          email: 'donatur@crowdfunding.id',
        },
      });

      if (response.data.success) {
        setQrisOrderId(response.data.data.order_id);
        setQrisRedirectUrl(response.data.data.redirect_url);
        setQrisStatus('pending');
        // Open Midtrans in new tab
        window.open(response.data.data.redirect_url, '_blank');
      }
    } catch (error: any) {
      console.error('QRIS creation error:', error);
      alert(error.response?.data?.message || 'Failed to create QRIS payment');
    } finally {
      setQrisLoading(false);
    }
  };

  const handleCryptoDonate = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > formattedBalance) {
      alert(`Insufficient ${paymentMethod} balance`);
      return;
    }

    await donate(Number(campaignId), amount);
  };

  const handleDonate = async () => {
    if (paymentMethod === 'QRIS') {
      await handleQrisDonate();
    } else {
      await handleCryptoDonate();
    }
  };

  const formatDisplayAmount = (val: number) => {
    if (paymentMethod === 'USDC') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    return formatIDR(val);
  };

  // Combined status for UI
  const status = paymentMethod === 'QRIS' ? qrisStatus : cryptoStatus;
  const txHash = paymentMethod === 'QRIS' ? qrisTxHash : cryptoTxHash;
  
  const reset = () => {
    if (paymentMethod === 'QRIS') {
      setQrisStatus('idle');
      setQrisOrderId(null);
      setQrisRedirectUrl(null);
      setQrisTxHash(null);
    } else {
      cryptoReset();
    }
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
               <p className="text-gray-600">Donasi {formatDisplayAmount(Number(amount))} berhasil diterima!</p>
              </div>
              {txHash && (
                <a 
                  href={`https://sepolia.basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 underline text-sm"
                >
                  Lihat di BaseScan →
                </a>
              )}
              <Button
                onClick={() => router.push(`/campaign/${campaignId}`)}
                variant="primary"
                size="lg"
                className="w-full rounded-xl shadow-lg"
              >
                Kembali ke Campaign
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaksi Gagal</h2>
                <p className="text-gray-600 text-sm">{cryptoError?.message || 'Terjadi kesalahan'}</p>
              </div>
              <Button
                onClick={reset}
                variant="primary"
                size="lg"
                className="w-full rounded-xl shadow-lg"
              >
                Coba Lagi
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  // QRIS Pending state (waiting for payment)
  if (qrisStatus === 'pending' || qrisStatus === 'checking') {
    return (
      <div className="min-h-screen w-full bg-white flex justify-center">
        <div className="w-full max-w-lg bg-[#FAFAFA] relative h-screen overflow-hidden flex flex-col shadow-2xl">
          <Gradient />
          <Container className="relative z-10 h-full flex flex-col items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6 max-w-sm w-full border border-white/50">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Menunggu Pembayaran</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Silakan selesaikan pembayaran di tab yang terbuka. Halaman ini akan otomatis update.
                </p>
                <p className="text-xs text-gray-400">
                  Order ID: {qrisOrderId}
                </p>
              </div>
              {qrisRedirectUrl && (
                <Button
                  onClick={() => window.open(qrisRedirectUrl, '_blank')}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl"
                >
                  Buka Halaman Pembayaran
                </Button>
              )}
              <Button
                onClick={async () => {
                  if (!qrisOrderId) return;
                  setQrisStatus('checking');
                  try {
                    const response = await api.post(`/crowdfunding/contribution/qris-status/${qrisOrderId}`);
                    if (response.data.success) {
                      setQrisStatus('success');
                      setQrisTxHash(response.data.data.donation?.donateTxHash);
                      saveDonation(Number(amount), campaignId);
                    } else {
                      setQrisStatus('pending');
                      alert(response.data.message || 'Pembayaran belum selesai');
                    }
                  } catch (err: any) {
                    setQrisStatus('pending');
                    alert(err.response?.data?.message || 'Gagal cek status');
                  }
                }}
                variant="primary"
                size="lg"
                disabled={qrisStatus === 'checking'}
                className="w-full rounded-xl shadow-lg"
              >
                {qrisStatus === 'checking' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengecek...
                  </span>
                ) : (
                  'Cek Status Pembayaran'
                )}
              </Button>
              <Button
                onClick={reset}
                variant="secondary"
                size="sm"
                className="text-gray-500"
              >
                Batalkan
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  const isProcessing = qrisLoading || cryptoStatus === 'approving' || cryptoStatus === 'donating' || cryptoStatus === 'confirming';

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

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Donasi</h1>
            {campaign && (
              <p className="text-gray-600 mb-6">{campaign.name}</p>
            )}
            
            {/* Payment Method Tabs */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/50 mb-6">
              <div className="flex gap-1">
                {(['QRIS', 'IDRX', 'USDC'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      setPaymentMethod(method);
                      setAmount('');
                    }}
                    disabled={isProcessing}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                      paymentMethod === method 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {method === 'QRIS' && <QrCode className="w-4 h-4" />}
                    {(method === 'IDRX' || method === 'USDC') && <Wallet className="w-4 h-4" />}
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* QRIS Info Banner */}
            {paymentMethod === 'QRIS' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <QrCode className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Tidak Perlu Wallet</p>
                    <p className="text-green-700 text-xs mt-1">
                      Bayar dengan QRIS dari aplikasi bank atau e-wallet manapun. Dana akan otomatis dikonversi ke IDRX.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Connect prompt (only for crypto) */}
            {isCrypto && !isConnected && (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Connect wallet untuk donasi {paymentMethod}</span>
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
            )}

            {/* Balance display (only for crypto when connected) */}
            {isCrypto && isConnected && (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex flex-col gap-2 border border-white/50 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Saldo {paymentMethod} Kamu</span>
                  <span className="text-sm font-medium text-gray-900">
                    {paymentMethod === 'IDRX' 
                      ? formatIDRXCurrency(formattedBalance * 100)
                      : `${formattedBalance.toLocaleString()} USDC`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Donation Form - Show for QRIS always, for crypto only when connected */}
            {(paymentMethod === 'QRIS' || (isCrypto && isConnected)) && (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-6 border border-white/50">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nominal Donasi {paymentMethod === 'USDC' ? '(USD)' : '(Rupiah)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      {paymentMethod === 'USDC' ? '$' : 'Rp'}
                    </span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder={paymentMethod === 'USDC' ? "10" : "10000"}
                      disabled={isProcessing}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                    />
                  </div>
                  
                  {/* Quick amount buttons */}
                  {paymentMethod !== 'USDC' && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                      {[5000, 10000, 25000, 50000, 100000].map((val) => (
                        <Button
                          key={val}
                          onClick={() => setAmount(val)}
                          variant={amount === val ? 'primary' : 'rounded'}
                          size="rounded"
                          disabled={isProcessing}
                          className={cn(
                            "whitespace-nowrap text-xs",
                            amount !== val && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {val.toLocaleString('id-ID')}
                        </Button>
                      ))}
                    </div>
                  )}

                  {paymentMethod === 'USDC' && (
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
                      {qrisLoading && 'Membuat QRIS...'}
                      {cryptoStatus === 'approving' && `Approving ${paymentMethod}...`}
                      {cryptoStatus === 'donating' && 'Confirm di wallet...'}
                      {cryptoStatus === 'confirming' && 'Mengonfirmasi...'}
                    </span>
                  ) : (
                    <>
                      {paymentMethod === 'QRIS' ? 'Bayar dengan QRIS' : 'Donasi Sekarang'}
                    </>
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
