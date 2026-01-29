'use client';

// Key for storage
const CHARITY_POINTS_KEY = 'crowdfunding_charity_points';
const IDRX_BALANCE_KEY = 'crowdfunding_idrx_balance_mock';

export const saveDonation = (amount: number, campaignId: string) => {
  if (typeof window === 'undefined') return;

  // Update Charity Points (+1 per donation event)
  const currentPoints = getCharityPoints();
  const newPoints = currentPoints + 1;
  localStorage.setItem(CHARITY_POINTS_KEY, newPoints.toString());

  // Update Vault/Minted IDRX (Mock)
  // Assuming 1:1 ratio for simplicity or just tracking amount
  const currentBalance = getVaultBalance();
  const newBalance = currentBalance + amount;
  localStorage.setItem(IDRX_BALANCE_KEY, newBalance.toString());

  console.log(`Donation saved: ${amount} for campaign ${campaignId}. Points: ${newPoints}, Balance: ${newBalance}`);
};

export const getCharityPoints = (): number => {
  if (typeof window === 'undefined') return 0;
  const points = localStorage.getItem(CHARITY_POINTS_KEY);
  return points ? parseInt(points, 10) : 0;
};

export const getVaultBalance = (): number => {
  if (typeof window === 'undefined') return 0;
  const balance = localStorage.getItem(IDRX_BALANCE_KEY);
  return balance ? parseFloat(balance) : 0;
};

export const withdrawFunds = (amount: number): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentBalance = getVaultBalance();
  if (currentBalance >= amount) {
    const newBalance = currentBalance - amount;
    localStorage.setItem(IDRX_BALANCE_KEY, newBalance.toString());
    return true;
  }
  return false;
};
