'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllCampaigns,
  getCampaignById,
  getDonationsByVault,
  getDonationsByUser,
  getBadgesByUser,
  getVaults,
  type Campaign,
  type CampaignDetail,
  type Donation,
  type Badge,
  type Vault,
} from '@/utils/api/crowdfunding';

// Query keys for cache management
export const crowdfundingKeys = {
  all: ['crowdfunding'] as const,
  campaigns: () => [...crowdfundingKeys.all, 'campaigns'] as const,
  campaign: (id: number | string) => [...crowdfundingKeys.campaigns(), id] as const,
  vaults: () => [...crowdfundingKeys.all, 'vaults'] as const,
  donations: () => [...crowdfundingKeys.all, 'donations'] as const,
  donationsByVault: (vaultId: string) => [...crowdfundingKeys.donations(), 'vault', vaultId] as const,
  donationsByUser: (address: string) => [...crowdfundingKeys.donations(), 'user', address] as const,
  badges: () => [...crowdfundingKeys.all, 'badges'] as const,
  badgesByUser: (address: string) => [...crowdfundingKeys.badges(), 'user', address] as const,
};

// ============================================
// HELPERS
// ============================================

// IDRX has 2 decimals - amount / 100
export const formatIDRX = (amount: string | number | undefined): number => {
  if (!amount) return 0;
  const numAmount = typeof amount === 'string' ? Number(amount) : amount;
  return numAmount / 100;
};

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatIDRXCurrency = (amount: string | number | undefined): string => {
  return formatIDR(formatIDRX(amount));
};

export const calculateProgress = (balance: string | undefined, targetAmount: string | undefined): number => {
  const raised = formatIDRX(balance);
  const target = formatIDRX(targetAmount);
  if (target === 0) return 0;
  return Math.min(Math.round((raised / target) * 100), 100);
};

export const formatTimestamp = (timestamp: number | string | undefined): Date => {
  if (!timestamp) return new Date();
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  return new Date(ts * 1000);
};

// ============================================
// CAMPAIGNS HOOKS
// ============================================

export function useCampaigns(options?: { enabled?: boolean; refetchInterval?: number }) {
  const { enabled = true, refetchInterval = 10000 } = options || {};

  return useQuery({
    queryKey: crowdfundingKeys.campaigns(),
    queryFn: getAllCampaigns,
    enabled,
    refetchInterval,
    staleTime: 5000,
  });
}

export function useCampaign(campaignId: number | string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: crowdfundingKeys.campaign(campaignId),
    queryFn: () => getCampaignById(campaignId),
    enabled: enabled && campaignId !== undefined,
    staleTime: 5000,
  });
}

/**
 * Campaigns mapped to UI format (for CampaignCard component)
 */
export function useCampaignsForUI(options?: { enabled?: boolean; refetchInterval?: number }) {
  const query = useCampaigns(options);

  const mappedData = query.data?.map((campaign) => ({
    // Original fields (camelCase from backend)
    id: String(campaign.id),
    name: campaign.name,
    creatorName: campaign.creatorName,
    owner: campaign.owner,
    balance: formatIDRX(campaign.balance),
    balanceFormatted: formatIDRXCurrency(campaign.balance),
    targetAmount: formatIDRX(campaign.targetAmount),
    targetAmountFormatted: formatIDRXCurrency(campaign.targetAmount),
    progress: calculateProgress(campaign.balance, campaign.targetAmount),
    creationTime: formatTimestamp(campaign.creationTime),
    // For CampaignCard compatibility
    imageUrl: '/assets/images/placeholder-2.webp',
    title: campaign.name,
    description: campaign.description || `Campaign by ${campaign.creatorName}`,
    needed: formatIDRX(campaign.targetAmount),
    raised: formatIDRX(campaign.balance),
  })) || [];

  return {
    ...query,
    campaigns: mappedData,
  };
}

// ============================================
// VAULTS HOOKS
// ============================================

export function useVaults(
  status: string = 'active',
  limit: number = 20,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval = 10000 } = options || {};

  return useQuery({
    queryKey: [...crowdfundingKeys.vaults(), status, limit],
    queryFn: () => getVaults(status, limit, 0),
    enabled,
    refetchInterval,
    staleTime: 5000,
  });
}

// ============================================
// DONATIONS HOOKS
// ============================================

export function useDonationsByVault(
  vaultId: string,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval = 10000 } = options || {};

  return useQuery({
    queryKey: crowdfundingKeys.donationsByVault(vaultId),
    queryFn: () => getDonationsByVault(vaultId),
    enabled: enabled && !!vaultId,
    refetchInterval,
    staleTime: 5000,
  });
}

export function useDonationsByUser(
  walletAddress: string | undefined,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval = 10000 } = options || {};

  return useQuery({
    queryKey: crowdfundingKeys.donationsByUser(walletAddress || ''),
    queryFn: () => getDonationsByUser(walletAddress || ''),
    enabled: enabled && !!walletAddress,
    refetchInterval,
    staleTime: 5000,
  });
}

export function useCampaignDonationStats(vaultId: string) {
  const { data: donations, isLoading, error } = useDonationsByVault(vaultId);

  const stats = {
    totalDonated: donations?.reduce((sum, d) => sum + formatIDRX(d.amount), 0) || 0,
    totalDonatedFormatted: formatIDR(
      donations?.reduce((sum, d) => sum + formatIDRX(d.amount), 0) || 0
    ),
    donationCount: donations?.length || 0,
    uniqueDonors: new Set(donations?.map((d) => d.donor.toLowerCase())).size || 0,
  };

  return { stats, isLoading, error };
}

// ============================================
// BADGES HOOKS
// ============================================

export function useBadgesByUser(
  walletAddress: string | undefined,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  const { enabled = true, refetchInterval = 10000 } = options || {};

  return useQuery({
    queryKey: crowdfundingKeys.badgesByUser(walletAddress || ''),
    queryFn: () => getBadgesByUser(walletAddress || ''),
    enabled: enabled && !!walletAddress,
    refetchInterval,
    staleTime: 5000,
  });
}

// ============================================
// CACHE INVALIDATION
// ============================================

export function useInvalidateCrowdfunding() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.all }),
    invalidateCampaigns: () => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.campaigns() }),
    invalidateCampaign: (id: number | string) => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.campaign(id) }),
    invalidateVaults: () => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.vaults() }),
    invalidateDonations: () => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.donations() }),
    invalidateBadges: () => queryClient.invalidateQueries({ queryKey: crowdfundingKeys.badges() }),
  };
}

// Re-export types
export type { Campaign, CampaignDetail, Donation, Badge, Vault };
