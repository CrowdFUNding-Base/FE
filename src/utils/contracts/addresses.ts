// Contract addresses for different networks
export const CONTRACTS = {
  baseSepolia: {
    // Tokens
    IDRX: '0xAC90f99347766F9b3b425Ca54248150e2C9D1Bde' as const,
    USDC: '0xC85840d4754aC06cEE7138eC0a664317921B6B5f' as const,
    // Core contracts
    CAMPAIGN: '0x669419298f071c321EF9B9cCA44be58E380A5fE3' as const,
    BADGE: '0x27EA9B34D708ff7646F92Dab287DfD43EbBA0d19' as const,
    MOCKSWAP: '0x3d03aa45D45d7ed60687927D7fD6740e4D445278' as const,
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
