// Contract addresses for different networks
export const CONTRACTS = {
  baseSepolia: {
    // Tokens
    IDRX: '0x387551ac55Bb6949d44715D07880f8c6260934B6' as const,
    USDC: '0x1b929eB40670aA4e0D757d45cA9aea2311a25a97' as const,
    // Core contracts
    CAMPAIGN: '0x44e87aa98d721Dbcf368690bF5aAb1F3dD944dA9' as const,
    BADGE: '0xaE32Df9Fb677aE68C5A1F956761a42e269Ebdc99' as const,
    MOCKSWAP: '0x554366984fD2f5D82c753F91357d80c29F887F17' as const,
  },
  // Base Mainnet (placeholder for future)
  base: {
    IDRX: '0x0000000000000000000000000000000000000000' as const,
    USDC: '0x0000000000000000000000000000000000000000' as const,
    CAMPAIGN: '0x0000000000000000000000000000000000000000' as const,
    BADGE: '0x0000000000000000000000000000000000000000' as const,
    MOCKSWAP: '0x0000000000000000000000000000000000000000' as const,
  },
} as const;

// Token decimals
export const TOKEN_DECIMALS = {
  IDRX: 2,
  USDC: 6,
} as const;

// Helper to get contract address by chain
export const getContractAddress = (
  chainId: number,
  contract: keyof typeof CONTRACTS.baseSepolia
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
