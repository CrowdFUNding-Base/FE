'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount, useDisconnect, useChainId, useReadContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/utils/helpers/cn';
import { ArrowUpRight, LogOut, Copy, Check } from 'lucide-react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { ERC20_ABI } from '@/utils/abi';
import { CONTRACTS } from '@/utils/contracts';

type WalletButtonProps = {
  className?: string;
};

export default function WalletButton({ className }: WalletButtonProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const currentChainId = useChainId();
  
  // Get IDRX token balance using direct contract read
  const { data: balanceData, isError, isLoading, refetch } = useReadContract({
    address: CONTRACTS.baseSepolia.IDRX,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000,
    },
  });

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: CONTRACTS.baseSepolia.IDRX,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId: baseSepolia.id,
  });

  // Refetch balance when chain changes
  useEffect(() => {
    if (isConnected && currentChainId === baseSepolia.id) {
      refetch();
    }
  }, [currentChainId, isConnected, refetch]);

  // Format balance to IDR format
  const formatBalance = (value: bigint | undefined, tokenDecimals: number = 2) => {
    if (!value) return 'IDR 0';
    const numValue = Number(value) / Math.pow(10, tokenDecimals);
    return `IDR ${numValue.toLocaleString('id-ID')}`;
  };

  // Display balance with fallback for loading/error states
  const getDisplayBalance = () => {
    if (isLoading) return 'Loading...';
    if (isError || balanceData === undefined) return 'IDR 0';
    const tokenDecimals = decimals !== undefined ? Number(decimals) : 2;
    return formatBalance(balanceData as bigint, tokenDecimals);
  };

  const displayBalance = getDisplayBalance();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
  };

  const toggleBalanceVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBalanceVisible(!isBalanceVisible);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
    setIsMenuOpen(false);
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleClick}
        size="wallet"
        variant="wallet"
        className={className}
        rightIcon={<ArrowUpRight className="w-5 h-5 text-cyan-50" />}
      >
        <span className="text-left text-cyan-50">Wallet</span>
        <span className="bg-cyan-800 px-4 py-1.5 rounded-lg text-sm font-sf-medium ml-18 text-cyan-50">
          Connect Wallet
        </span>
      </Button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'flex items-center justify-between',
          'w-full max-w-[320px] h-14',
          'rounded-2xl px-5',
          'font-sf-medium text-white',
          'bg-cyan-700',
          'transition-all duration-200 ease-out',
          'hover:bg-cyan-700 active:bg-cyan-700',
          'shadow-[0px_8px_20px_rgba(0,0,0,0.1),0px_2px_6px_rgba(0,0,0,0.15)]',
          'relative cursor-pointer',
          'before:absolute before:inset-0 before:rounded-2xl',
          'before:shadow-[inset_0px_1px_2px_rgba(255,255,255,0.2),inset_0px_-2px_3px_rgba(0,0,0,0.1)]',
          'text-cyan-50',
          className
        )}
      >
        <span className="text-base text-cyan-50">Wallet</span>
        <div className="flex items-center gap-2 z-10">
          {/* Balance Box with Eye Icon Inside */}
          <div className="bg-cyan-800 px-3 py-1.5 rounded-lg flex items-center gap-2 min-w-[140px]">
            <button
              onClick={toggleBalanceVisibility}
              className="p-0.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isBalanceVisible ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isBalanceVisible ? (
                    <IoEye className="w-4 h-4 text-white" />
                  ) : (
                    <IoEyeOff className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
            <span className="text-sm font-sf-medium flex-1 text-center text-cyan-50">
              {isBalanceVisible ? displayBalance : '**********'}
            </span>
          </div>
          
          {/* Arrow Menu Toggle */}
          <div
            role="button"
            tabIndex={0}
            onClick={toggleMenu}
            onKeyDown={(e) => e.key === 'Enter' && toggleMenu(e as unknown as React.MouseEvent)}
            className={cn(
              'p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer',
              isMenuOpen && 'bg-white/10'
            )}
          >
            <ArrowUpRight className={cn('w-5 h-5 transition-transform', isMenuOpen && 'rotate-90')} />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* Address */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Connected Wallet</p>
            <p className="text-sm font-sf-medium text-gray-800">
              {address && shortenAddress(address)}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{isCopied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
