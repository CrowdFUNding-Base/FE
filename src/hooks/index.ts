// Main hooks for crowdfunding (hits Backend API at localhost:3300)
export {
  // Campaign hooks
  useCampaigns,
  useCampaign,
  useCampaignsForUI,
  // Vault hooks
  useVaults,
  // Donation hooks
  useDonationsByVault,
  useDonationsByUser,
  useCampaignDonationStats,
  // Badge hooks
  useBadgesByUser,
  // Cache invalidation
  useInvalidateCrowdfunding,
  crowdfundingKeys,
  // Helpers
  formatIDRX,
  formatIDR,
  formatIDRXCurrency,
  calculateProgress,
  formatTimestamp,
  // Types
  type Campaign,
  type CampaignDetail,
  type Donation,
  type Badge,
  type Vault,
} from './useCrowdfunding';

// Smart contract interaction hooks
export { useCreateCampaign, type CreateCampaignParams, type TransactionStatus } from './useCreateCampaign';
export { useDonate, type DonateStatus } from './useDonate';
export { useWithdraw, type WithdrawStatus } from './useWithdraw';


