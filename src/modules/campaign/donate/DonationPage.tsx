'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet, QrCode, CheckCircle, Loader2 } from 'lucide-react';
import Gradient from '@/components/element/Gradient';
import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';
import { saveDonation, getCharityPoints } from '@/utils/localStorage';
import { Button } from '@/components/element/Button';

interface DonationPageProps {
  campaignId: string;
}

export default function DonationPage({ campaignId }: DonationPageProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [amount, setAmount] = useState<number | ''>('');
  const [isQrisGenerated, setIsQrisGenerated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock checking if user is the owner (for demo purposes, assumes specific address)
  // Or just mock it if connected for easy testing
  const isOwner = isConnected; // Allow any connected user to withdraw for demo 

  const handleGenerateQris = () => {
    if (!amount || amount < 1000) {
      alert('Minimum donation is Rp 1.000');
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsQrisGenerated(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      saveDonation(Number(amount), campaignId);
      setPaymentSuccess(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleWithdraw = () => {
    // Navigate to Withdraw page
    router.push(`/campaign/${campaignId}/withdraw`);
  };

  if (paymentSuccess) {
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600">Your donation has been received. You earned +1 Charity Point!</p>
                </div>
                <Button
                    onClick={() => router.push(`/profile`)}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg"
                >
                    Check My Profile
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
            
            {/* Helper / Wallet Connect */}
            {!isConnected ? (
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Connect to track donations</span>
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
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between border border-white/50">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                {address || 'Connected User'}
                </span>
                {isOwner && (
                <Button 
                    onClick={handleWithdraw}
                    variant="primary"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 rounded-lg"
                >
                    Withdraw
                </Button>
                )}
            </div>
            )}

            {/* Donation Form */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col gap-6 border border-white/50 mt-6">
            {!isQrisGenerated ? (
                <>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Amount (IDR)</label>
                    <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="50000"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                    {[10000, 25000, 50000, 100000].map((val) => (
                        <Button
                        key={val}
                        onClick={() => setAmount(val)}
                        variant={amount === val ? 'primary' : 'rounded'}
                        size="rounded"
                        className={cn(
                            "whitespace-nowrap",
                            amount !== val && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                        >
                        {val.toLocaleString('id-ID')}
                        </Button>
                    ))}
                    </div>
                </div>

                <Button
                    onClick={handleGenerateQris}
                    disabled={isProcessing}
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl shadow-lg"
                    leftIcon={isProcessing ? <Loader2 className="animate-spin" /> : <QrCode className="w-5 h-5" />}
                >
                    Generate QRIS
                </Button>
                </>
            ) : (
                <div className="flex flex-col items-center animate-in fade-in duration-500">
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-4 w-full aspect-square flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <QrCode className="w-24 h-24 text-gray-800 mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-gray-500 font-mono">MOCK QRIS - {Number(amount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
                
                <p className="text-sm text-center text-gray-500 mb-6">
                    Scan this QR code with your payment app to mock the donation.
                </p>

                <Button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    variant="primary"
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 rounded-xl shadow-lg"
                    leftIcon={isProcessing && <Loader2 className="animate-spin" />}
                >
                    {isProcessing ? 'Processing...' : 'Simulate Payment Success'}
                </Button>
                
                <button
                    onClick={() => setIsQrisGenerated(false)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline"
                >
                    Cancel
                </button>
                </div>
            )}
            </div>
            </div>
        </Container>
      </div>
    </div>
  );
}
