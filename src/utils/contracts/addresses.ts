// Contract addresses for different networks
export const CONTRACTS = {
  // Base Sepolia (testnet)
  baseSepolia: {
    IDRX: '0x4a49f09fAfA1c493E5FC12dA89Ae8E0193E7e8AE' as const,
  },
  // Base Mainnet
  base: {
    IDRX: '0x0000000000000000000000000000000000000000' as const, // TODO: Add mainnet address
  },
} as const;

// Helper to get contract address by chain
export const getContractAddress = (
  chainId: number,
  contract: 'IDRX'
): `0x${string}` | null => {
  switch (chainId) {
    case 84532: // Base Sepolia
      return CONTRACTS.baseSepolia[contract];
    case 8453: // Base Mainnet
      return CONTRACTS.base[contract];
    default:
      return null;
  }
};
