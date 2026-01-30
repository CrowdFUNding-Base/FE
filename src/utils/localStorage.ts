'use client';

// Key for storage
const CHARITY_POINTS_KEY = 'crowdfunding_charity_points';
const IDRX_BALANCE_KEY = 'crowdfunding_idrx_balance_mock';
const STREAK_KEY = 'crowdfunding_streak';
const LAST_DONATION_DATE_KEY = 'crowdfunding_last_donation_date';
const TOTAL_DONATED_KEY = 'crowdfunding_total_donated';

// Get current streak
export const getStreak = (): number => {
  if (typeof window === 'undefined') return 0;
  const streak = localStorage.getItem(STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};

// Get total donated amount
export const getTotalDonated = (): number => {
  if (typeof window === 'undefined') return 0;
  const total = localStorage.getItem(TOTAL_DONATED_KEY);
  return total ? parseFloat(total) : 0;
};

export const saveDonation = (amount: number, campaignId: string) => {
  if (typeof window === 'undefined') return;

  // Update Charity Points (+1 per donation event)
  const currentPoints = getCharityPoints();
  const newPoints = currentPoints + 1;
  localStorage.setItem(CHARITY_POINTS_KEY, newPoints.toString());

  // Update Vault/Minted IDRX (Mock)
  const currentBalance = getVaultBalance();
  const newBalance = currentBalance + amount;
  localStorage.setItem(IDRX_BALANCE_KEY, newBalance.toString());

  // Update total donated
  const currentTotal = getTotalDonated();
  const newTotal = currentTotal + amount;
  localStorage.setItem(TOTAL_DONATED_KEY, newTotal.toString());

  // Update streak (consecutive day logic)
  const today = new Date().toDateString();
  const lastDonationDate = localStorage.getItem(LAST_DONATION_DATE_KEY);

  if (lastDonationDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDonationDate === today) {
      // Already donated today, don't change streak
    } else if (lastDonationDate === yesterday.toDateString()) {
      // Consecutive day, increment streak
      const currentStreak = getStreak();
      localStorage.setItem(STREAK_KEY, (currentStreak + 1).toString());
    } else {
      // Streak broken, reset to 1
      localStorage.setItem(STREAK_KEY, '1');
    }
  } else {
    // First donation ever
    localStorage.setItem(STREAK_KEY, '1');
  }

  localStorage.setItem(LAST_DONATION_DATE_KEY, today);

  console.log(`Donation saved: ${amount} for campaign ${campaignId}. Points: ${newPoints}, Balance: ${newBalance}, Total Donated: ${newTotal}, Streak: ${getStreak()}`);
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
