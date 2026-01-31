import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';

export interface VaultData {
  vault: {
    vaultId: string;
    campaignId: number;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    currency: string;
    status: string;
    endDate: string;
    createdAt: string;
  };
  blockchain: {
    campaignId: number;
    name: string;
    creatorName: string;
    owner: string;
    balance: string;
    targetAmount: string;
    creationTime: string;
    lastSyncedAt: string;
  } | null;
}

export interface VaultDetailsData extends VaultData {
  // Same structure as VaultData
}

export interface VaultsResponse {
  success: boolean;
  data: VaultData[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    source: string;
  };
}

export interface VaultDetailsResponse {
  success: boolean;
  data: VaultDetailsData;
}

/**
 * Get all vaults/campaigns
 */
export const getAllVaults = async (params?: {
  status?: 'active' | 'completed' | 'cancelled' | 'expired';
  limit?: number;
  offset?: number;
}): Promise<VaultsResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/vaults`, {
      params: {
        status: params?.status || 'active',
        limit: params?.limit || 20,
        offset: params?.offset || 0,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vaults');
  }
};

/**
 * Get vault details by ID
 */
export const getVaultDetails = async (vaultId: string): Promise<VaultDetailsResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/vaults/${vaultId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vault details');
  }
};

/**
 * Get vault donations
 */
export const getVaultDonations = async (
  vaultId: string,
  params?: {
    limit?: number;
    offset?: number;
  }
) => {
  try {
    const response = await axios.get(`${API_URL}/api/vaults/${vaultId}/donations`, {
      params: {
        limit: params?.limit || 50,
        offset: params?.offset || 0,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch donations');
  }
};

/**
 * Get vault statistics
 */
export const getVaultStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/vaults/statistics`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};
