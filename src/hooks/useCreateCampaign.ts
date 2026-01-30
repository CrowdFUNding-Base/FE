'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CAMPAIGN_ABI } from '@/utils/abi/campaign';
import { CONTRACTS } from '@/utils/contracts/addresses';
import { useInvalidateCrowdfunding } from './useCrowdfunding';

// Campaign contract address on Base Sepolia
const CAMPAIGN_CONTRACT = CONTRACTS.baseSepolia.CAMPAIGN;

export interface CreateCampaignParams {
  name: string;
  creatorName: string;
  targetAmount: number; // In IDRX display format (e.g., 1000 = Rp 1000)
}

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export interface UseCreateCampaignResult {
  createCampaign: (params: CreateCampaignParams) => Promise<void>;
  status: TransactionStatus;
  txHash: `0x${string}` | undefined;
  error: Error | null;
  reset: () => void;
  isConnected: boolean;
}

/**
 * Hook for creating campaigns on-chain
 * 
 * Usage:
 * const { createCampaign, status, txHash, error } = useCreateCampaign();
 * 
 * await createCampaign({
 *   name: "Campaign Title",
 *   creatorName: "Creator Name",
 *   targetAmount: 1000 // Rp 1000
 * });
 */
export function useCreateCampaign(): UseCreateCampaignResult {
  const [status, setStatus] = useState<TransactionStatus>('idle');
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
    // Invalidate campaign cache so list refreshes
    invalidateCampaigns();
  }

  if (writeError && status !== 'error') {
    setStatus('error');
    setError(writeError);
  }

  const createCampaign = useCallback(
    async (params: CreateCampaignParams) => {
      if (!isConnected) {
        setError(new Error('Wallet not connected'));
        setStatus('error');
        return;
      }

      try {
        setStatus('pending');
        setError(null);

        // Convert targetAmount to on-chain format (multiply by 100 for 2 decimals)
        const targetAmountOnChain = BigInt(Math.round(params.targetAmount * 100));

        writeContract({
          address: CAMPAIGN_CONTRACT,
          abi: CAMPAIGN_ABI,
          functionName: 'createCampaign',
          args: [params.name, params.creatorName, targetAmountOnChain],
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create campaign'));
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
    createCampaign,
    status,
    txHash,
    error,
    reset,
    isConnected,
  };
}
