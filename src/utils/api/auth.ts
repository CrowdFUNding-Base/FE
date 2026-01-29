import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';

export interface WalletLoginData {
  walletAddress: string;
  role?: 'contributor' | 'campaigner';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email?: string;
    name: string;
    walletAddress?: string;
  };
}

/**
 * Web3 Wallet Login
 */
export const loginWithWallet = async (data: WalletLoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/wallet-login`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Wallet login failed');
  }
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};
