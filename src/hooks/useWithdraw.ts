'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CAMPAIGN_ABI } from '@/utils/abi/campaign';
import { CONTRACTS, TOKEN_DECIMALS } from '@/utils/contracts/addresses';
import { useInvalidateCrowdfunding } from './useCrowdfunding';

const CAMPAIGN_CONTRACT = CONTRACTS.baseSepolia.CAMPAIGN;

export type WithdrawStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export interface UseWithdrawResult {
  withdraw: (campaignId: number, amount: number) => Promise<void>;
  status: WithdrawStatus;
  txHash: `0x${string}` | undefined;
  error: Error | null;
  reset: () => void;
  isConnected: boolean;
}

/**
 * Hook for withdrawing IDRX from campaigns (owner only)
 * 
 * Calls: withdraw(campaignId, amount) on Campaign contract
 */
export function useWithdraw(): UseWithdrawResult {
  const [status, setStatus] = useState<WithdrawStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const { isConnected } = useAccount();
  const { invalidateCampaigns } = useInvalidateCrowdfunding();

  const {
    data: txHash,
    writeContract,
    reset: resetWrite,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Update status based on transaction state
  if (isConfirming && status !== 'confirming') {
    setStatus('confirming');
  }

  if (isSuccess && status !== 'success') {
    setStatus('success');
    invalidateCampaigns();
  }

  if (writeError && status !== 'error') {
    setStatus('error');
    setError(writeError);
  }

  const withdraw = useCallback(
    async (campaignId: number, amount: number) => {
      if (!isConnected) {
        setError(new Error('Wallet not connected'));
        setStatus('error');
        return;
      }

      try {
        setStatus('pending');
        setError(null);

        // Convert amount to on-chain format (2 decimals for IDRX)
        const amountOnChain = BigInt(Math.round(amount * (10 ** TOKEN_DECIMALS.IDRX)));

        writeContract({
          address: CAMPAIGN_CONTRACT,
          abi: CAMPAIGN_ABI,
          functionName: 'withdraw',
          args: [BigInt(campaignId), amountOnChain],
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to withdraw'));
        setStatus('error');
      }
    },
    [isConnected, writeContract]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    resetWrite();
  }, [resetWrite]);

  return {
    withdraw,
    status,
    txHash,
    error,
    reset,
    isConnected,
  };
}
