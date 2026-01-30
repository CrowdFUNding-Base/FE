import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';

// Types matching EXACT backend response (camelCase from indexer)
export interface Campaign {
  id: number;
  name: string;
  creatorName: string;
  owner: string;
  balance: string;
  targetAmount: string;
  creationTime: number;
  description?: string;
  lastSyncedAt?: string;
  description?: string;
}

export interface CampaignDetail {
  campaign: Campaign;
  vault: Vault | null;
}

export interface Vault {
  vaultId: string;
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  currency: string;
  status: string;
  endDate: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  campaign_id: number;
  donor: string;
  amount: string;
  timestamp: number;
  transaction_hash: string;
  block_number?: number;
  campaign_name?: string;
  campaign_creator?: string;
}

export interface Badge {
  id: string;
  token_id: number;
  owner: string;
  name: string;
  description?: string;
  timestamp: number;
}

// Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    limit: number;
    offset: number;
    source?: string;
  };
}

// ============================================
// API Functions
// ============================================

/**
 * Get all campaigns
 */
export const getAllCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_URL}/crowdfunding/campaigns`
    );
    
    if (response.data.success) {
      // Normalize snake_case to camelCase
      return (response.data.data || []).map(item => ({
        ...item,
        creatorName: item.creatorName || item.creator_name,
        targetAmount: item.targetAmount || item.target_amount,
        creationTime: item.creationTime || item.creation_time,
        lastSyncedAt: item.lastSyncedAt || item.last_synced_at
      }));
    }
    
    console.error('Failed to fetch campaigns:', response.data.message);
    return [];
  } catch (error: any) {
    console.error('Failed to fetch campaigns:', error?.message || error);
    return [];
  }
};

/**
 * Get campaign by ID (includes vault info)
 */
export const getCampaignById = async (id: number | string): Promise<CampaignDetail | null> => {
  try {
    const response = await axios.get<ApiResponse<any>>(
      `${API_URL}/crowdfunding/campaigns/${id}`
    );
    
    if (response.data.success) {
      const data = response.data.data;
      if (!data) return null;
      
      // Normalize campaign data if needed
      const campaign = {
        ...data.campaign,
        creatorName: data.campaign.creatorName || data.campaign.creator_name,
        targetAmount: data.campaign.targetAmount || data.campaign.target_amount,
        creationTime: data.campaign.creationTime || data.campaign.creation_time,
        lastSyncedAt: data.campaign.lastSyncedAt || data.campaign.last_synced_at
      };

      return {
        ...data,
        campaign
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Failed to fetch campaign:', error?.message || error);
    return null;
  }
};

/**
 * Get all vaults with optional filters
 */
export const getVaults = async (
  status: string = 'active',
  limit: number = 20,
  offset: number = 0
): Promise<{ vault: Vault; blockchain: Campaign | null }[]> => {
  try {
    const response = await axios.get<ApiResponse<{ vault: Vault; blockchain: Campaign | null }[]>>(
      `${API_URL}/crowdfunding/vaults`,
      { params: { status, limit, offset } }
    );
    
    if (response.data.success) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to fetch vaults:', error?.message || error);
    return [];
  }
};

/**
 * Get donations for a vault
 */
export const getDonationsByVault = async (vaultId: string): Promise<Donation[]> => {
  try {
    const response = await axios.get<ApiResponse<Donation[]>>(
      `${API_URL}/crowdfunding/vault/${vaultId}/donations`
    );
    
    if (response.data.success) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to fetch vault donations:', error?.message || error);
    return [];
  }
};

/**
 * Get donations by user wallet address
 */
export const getDonationsByUser = async (walletAddress: string): Promise<Donation[]> => {
  try {
    const response = await axios.get<ApiResponse<Donation[]>>(
      `${API_URL}/crowdfunding/donations/user/${walletAddress}`
    );
    
    if (response.data.success) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to fetch user donations:', error?.message || error);
    return [];
  }
};

/**
 * Get badges by user wallet address
 */
export const getBadgesByUser = async (walletAddress: string): Promise<Badge[]> => {
  try {
    const response = await axios.get<ApiResponse<Badge[]>>(
      `${API_URL}/crowdfunding/badges/user/${walletAddress}`
    );
    
    if (response.data.success) {
      return response.data.data || [];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to fetch user badges:', error?.message || error);
    return [];
  }
};
