import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';

export interface SyncCheckResponse {
  success: boolean;
  needsSync: boolean;
  conflict?: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    fullname?: string;
    walletAddress?: string;
  };
  conflictUser?: {
    id: string;
    email: string;
    fullname: string;
  };
  walletAddress?: string;
  email?: string;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    fullname: string;
    walletAddress?: string;
  };
}

/**
 * Check if wallet can be synced with current Google account
 */
export const checkWalletSync = async (walletAddress: string): Promise<SyncCheckResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/check-wallet-sync`,
      { walletAddress },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.response?.data?.message || 'Failed to check wallet sync');
  }
};

/**
 * Sync wallet with current Google account
 */
export const syncWallet = async (
  walletAddress: string,
  role: 'contributor' | 'campaigner' = 'contributor'
): Promise<SyncResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/sync-wallet`,
      { walletAddress, role },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sync wallet');
  }
};

/**
 * Check if Google account can be synced with current wallet
 */
export const checkGoogleSync = async (email: string): Promise<SyncCheckResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/check-google-sync`,
      { email },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.response?.data?.message || 'Failed to check Google sync');
  }
};
