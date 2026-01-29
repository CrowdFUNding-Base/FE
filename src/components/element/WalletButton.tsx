'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAccount, useDisconnect, useChainId, useReadContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/utils/helpers/cn';
import { ArrowUpRight, LogOut, Copy, Check, EyeClosed } from 'lucide-react';
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
  const [selectedToken, setSelectedToken] = useState<'IDRX' | 'USDC'>('IDRX');
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const currentChainId = useChainId();
  
  // Get IDRX token balance
  const { data: idrxBalanceData, isError: isIdrxError, isLoading: isIdrxLoading, refetch: refetchIdrx } = useReadContract({
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

  // Get USDC token balance
  const { data: usdcBalanceData, isError: isUsdcError, isLoading: isUsdcLoading, refetch: refetchUsdc } = useReadContract({
    address: CONTRACTS.baseSepolia.USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000,
    },
  });

  // Get token decimals (IDRX)
  const { data: idrxDecimals } = useReadContract({
    address: CONTRACTS.baseSepolia.IDRX,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId: baseSepolia.id,
  });

  // Get token decimals (USDC)
  const { data: usdcDecimals } = useReadContract({
    address: CONTRACTS.baseSepolia.USDC,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId: baseSepolia.id,
  });

  // Refetch balances when chain changes
  useEffect(() => {
    if (isConnected && currentChainId === baseSepolia.id) {
      refetchIdrx();
      refetchUsdc();
    }
  }, [currentChainId, isConnected, refetchIdrx, refetchUsdc]);

  // Format balance
  const formatBalance = (value: bigint | undefined, tokenDecimals: number = 2, symbol: string) => {
    if (!value) return `${symbol} 0`;
    const numValue = Number(value) / Math.pow(10, tokenDecimals);
    return `${symbol} ${numValue.toLocaleString('id-ID')}`;
  };

  // Display balance based on selected token
  const getDisplayBalance = () => {
    if (selectedToken === 'IDRX') {
      if (isIdrxLoading) return 'Loading...';
      if (isIdrxError || idrxBalanceData === undefined) return 'IDR 0';
      const tokenDecimals = idrxDecimals !== undefined ? Number(idrxDecimals) : 2;
      return formatBalance(idrxBalanceData as bigint, tokenDecimals, 'IDRX');
    } else {
      if (isUsdcLoading) return 'Loading...';
      if (isUsdcError || usdcBalanceData === undefined) return 'USDC 0';
      const tokenDecimals = usdcDecimals !== undefined ? Number(usdcDecimals) : 6;
      return formatBalance(usdcBalanceData as bigint, tokenDecimals, 'USDC');
    }
  };

  const displayBalance = getDisplayBalance();

  // Ref for the dropdown menu (since it's in a portal)
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside both the main button reference AND the dropdown reference
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

      if (isOutsideMenu && isOutsideDropdown) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
    <div ref={menuRef} className="relative w-full">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'flex items-center justify-between',
          'w-auto h-14',
          'rounded-3xl px-5',
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
                    <EyeClosed className="w-4 h-4 text-white" />
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
            <ArrowUpRight className={cn('w-5 h-5 transition-transform', isMenuOpen && 'rotate-180')} />
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Portaled */}
      {isMenuOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: 'fixed',
                top: menuRef.current ? menuRef.current.getBoundingClientRect().bottom + 12 : 0,
                left: menuRef.current ? menuRef.current.getBoundingClientRect().right - 280 : 0, // aligning right edge, assuming 280px width
                zIndex: 9999
              }}
              className={cn(
                  "min-w-[280px] w-auto",
                  "bg-white/80 backdrop-blur-xl",
                  "rounded-[32px]",
                  "shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.1)]",
                  "border border-white/40",
                  "overflow-hidden",
                  "p-2"
              )}
            >
             <div className="bg-white/50 rounded-[24px] p-4 border border-white/50">
                  {/* Address */}
                  <div className="mb-4 text-center">
                      <p className="text-xs font-sf-regular text-gray-500 mb-1">Connected Wallet</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100/50 rounded-full border border-gray-200/50">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-sm font-sf-bold text-gray-800 tracking-wide font-mono">
                          {address && shortenAddress(address)}
                          </p>
                      </div>
                  </div>
  
                  {/* Token Selector */}
                  <div className="bg-gray-50/80 rounded-2xl p-1.5 flex gap-1 mb-2">
                      <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedToken('IDRX'); }}
                          className={cn(
                          "flex-1 py-2 text-xs font-sf-bold rounded-xl transition-all duration-200",
                          selectedToken === 'IDRX' 
                              ? "bg-white text-cyan-700 shadow-sm" 
                              : "text-gray-400 hover:bg-gray-200/50"
                          )}
                      >
                          IDR
                      </button>
                      <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedToken('USDC'); }}
                          className={cn(
                          "flex-1 py-2 text-xs font-sf-bold rounded-xl transition-all duration-200",
                          selectedToken === 'USDC' 
                              ? "bg-white text-cyan-700 shadow-sm" 
                              : "text-gray-400 hover:bg-gray-200/50"
                          )}
                      >
                          USDC
                      </button>
                  </div>
             </div>
  
              {/* Menu Items */}
              <div className="flex flex-col gap-1 mt-2 px-1 pb-1">
                <button
                  onClick={handleCopyAddress}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sf-medium text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-2xl transition-all group"
                >
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white transition-colors">
                      {isCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                      ) : (
                      <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                      )}
                  </div>
                  <span>{isCopied ? 'Copied!' : 'Copy Address'}</span>
                </button>
                
                <div className="h-px bg-gray-100 mx-4 my-1" />
  
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sf-medium text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-all group"
                >
                  <div className="p-2 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                      <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  <span>Disconnect</span>
                </button>
              </div>
            </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
