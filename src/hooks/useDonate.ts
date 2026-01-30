'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { CAMPAIGN_ABI } from '@/utils/abi/campaign';
import { ERC20_ABI } from '@/utils/abi/erc20';
import { CONTRACTS } from '@/utils/contracts/addresses';
import { useInvalidateCrowdfunding } from './useCrowdfunding';
import {  maxUint256, type Address } from 'viem';

const CAMPAIGN_CONTRACT = CONTRACTS.baseSepolia.CAMPAIGN;

export type DonateStatus = 'idle' | 'approving' | 'donating' | 'confirming' | 'success' | 'error';

export interface UseDonateResult {
  donate: (campaignId: number, amount: number) => Promise<void>;
  status: DonateStatus;
  txHash: `0x${string}` | undefined;
  error: Error | null;
  reset: () => void;
  isConnected: boolean;
  needsApproval: boolean;
  checkAllowance: (amount: number) => Promise<boolean>;
}

export function useDonate(tokenAddress: Address, decimals: number): UseDonateResult {
  const [status, setStatus] = useState<DonateStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  
  // Track pending donation for auto-trigger
  const [pendingDonation, setPendingDonation] = useState<{ id: number; amountOnChain: bigint } | null>(null);

  const { address, isConnected } = useAccount();
  const { invalidateCampaigns } = useInvalidateCrowdfunding();

  // Hook 1: Approval
  const {
    data: approveHash,
    writeContract: writeApprove,
    reset: resetApprove,
    error: approveError,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Hook 2: Donation
  const {
    data: donateHash,
    writeContract: writeDonate,
    reset: resetDonate,
    error: donateError,
  } = useWriteContract();

  const { isLoading: isDonateConfirming, isSuccess: isDonateSuccess } = useWaitForTransactionReceipt({
    hash: donateHash,
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CAMPAIGN_CONTRACT] : undefined,
  });

  // Unified Error Handling
  useEffect(() => {
    if (approveError || donateError) {
      setStatus('error');
      setError(approveError || donateError);
    }
  }, [approveError, donateError]);

  // Status Updates: Confirming
  useEffect(() => {
    if ((isApproveConfirming || isDonateConfirming) && status !== 'confirming') {
      setStatus('confirming');
    }
  }, [isApproveConfirming, isDonateConfirming, status]);

  // Success Handling
  useEffect(() => {
    // 1. Approval Success -> Trigger Donation
    if (isApproveSuccess && status === 'confirming' && pendingDonation) {
      console.log('Approval confirmed, keeping flow active for donation...');
      // IMPORTANT: Do NOT set status to success here. 
      // Switch immediately to donating status for UI feedback
      setStatus('donating'); 
      
      // Auto-trigger donation
      writeDonate({
        address: CAMPAIGN_CONTRACT,
        abi: CAMPAIGN_ABI,
        functionName: 'donate',
        args: [BigInt(pendingDonation.id), pendingDonation.amountOnChain, tokenAddress],
      });
      
      // Clear pending donation to prevent loops
      setPendingDonation(null); 
    }

    // 2. Donation Success -> Final State
    if (isDonateSuccess && status === 'confirming') {
      setStatus('success');
      invalidateCampaigns();
    }
  }, [isApproveSuccess, isDonateSuccess, status, pendingDonation, writeDonate, invalidateCampaigns, tokenAddress]);


  // Check approval helper
  const checkAllowance = useCallback(async (amount: number): Promise<boolean> => {
    await refetchAllowance();
    const amountOnChain = BigInt(Math.round(amount * (10 ** decimals)));
    const currentAllowance = allowance as bigint || BigInt(0);
    const needsApprove = currentAllowance < amountOnChain;
    setNeedsApproval(needsApprove);
    return needsApprove;
  }, [allowance, refetchAllowance, decimals]);

  // Main donate function
  const donate = useCallback(
    async (campaignId: number, amount: number) => {
      if (!isConnected) {
        setError(new Error('Wallet not connected'));
        setStatus('error');
        return;
      }

      try {
        const amountOnChain = BigInt(Math.round(amount * (10 ** decimals)));

        // Check allowance
        const { data: currentAllowance } = await refetchAllowance();
        const allowanceVal = currentAllowance as bigint || BigInt(0);
        
        if (allowanceVal < amountOnChain) {
          // APPROVE FLOW
          setStatus('approving');
          setNeedsApproval(true);
          setPendingDonation({ id: campaignId, amountOnChain }); // Store for step 2
          
          writeApprove({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [CAMPAIGN_CONTRACT, maxUint256], // Unlimited approval
          });
        } else {
          // DIRECT DONATE FLOW
          setStatus('donating');
          setError(null);
          
          writeDonate({
            address: CAMPAIGN_CONTRACT,
            abi: CAMPAIGN_ABI,
            functionName: 'donate',
            args: [BigInt(campaignId), amountOnChain, tokenAddress],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to donate'));
        setStatus('error');
      }
    },
    [isConnected, writeApprove, writeDonate, refetchAllowance, decimals, tokenAddress]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setNeedsApproval(false);
    setPendingDonation(null);
    resetApprove();
    resetDonate();
  }, [resetApprove, resetDonate]);

  return {
    donate,
    status,
    // Return relevant hash based on active process
    txHash: isApproveConfirming ? approveHash : (donateHash || approveHash),
    error,
    reset,
    isConnected,
    needsApproval,
    checkAllowance,
  };
}
