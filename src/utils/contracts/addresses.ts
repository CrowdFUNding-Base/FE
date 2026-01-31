// Contract addresses for different networks
export const CONTRACTS = {
  baseSepolia: {
    // Tokens
    IDRX: '0x46d84937891D4618f2D70Db4794DFe9cFb628E46' as const,
    USDC: '0x2D34d56F3E1f64FFa297f88E7828Ec0EC7d825f6' as const,
    // Core contracts
    CAMPAIGN: '0x17fb0DD846d2299F525ca0d0402C607C580e80c8' as const,
    BADGE: '0x8bdfD4C3f8e108687ABA5d9ebD9aFFe355545471' as const,
    MOCKSWAP: '0xd3D4F196434E8EDCc897F47b36E1234BB514f5BA' as const,
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
