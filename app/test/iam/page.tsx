'use client';

import WalletButton from '@/components/element/WalletButton';
import CharityCard, { CoinDisplay } from '@/components/element/CharityCard';
import LeaderboardCard, { LeaderboardListItem } from '@/components/element/LeaderboardCard';

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-sf-bold text-gray-900 mb-8">
        Component Showcase
      </h1>

      {/* Wallet Button Section */}
      <section className="mb-12">
        <h2 className="text-xl font-sf-semibold text-gray-800 mb-4">
          Wallet Button
        </h2>
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <WalletButton />
          <p className="text-sm text-gray-500 mt-4">
            Note: set up NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env file, the id is : f8aabd752876f7f9ef70f2ed2ff74639
          </p>
        </div>
      </section>

      {/* Charity Card Section */}
      <section className="mb-12">
        <h2 className="text-xl font-sf-semibold text-gray-800 mb-4">
          Charity Card
        </h2>
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {/* Full Variant */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              Full Variant (with Streak)
            </h3>
            <CharityCard 
              collected={4} 
              streak={10} 
              totalDays={7}
              onArrowClick={() => alert('Arrow clicked!')}
            />
          </div>

          {/* Compact Variant */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              Compact Variant
            </h3>
            <CharityCard 
              collected={4} 
              totalDays={7}
              variant="compact"
              onArrowClick={() => alert('Arrow clicked!')}
            />
          </div>

          {/* Coin Display */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              Coin Display (standalone)
            </h3>
            <div className="flex items-center gap-8">
              <CoinDisplay count={0} size="sm" />
              <CoinDisplay count={10} size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Card Section */}
      <section className="mb-12">
        <h2 className="text-xl font-sf-semibold text-gray-800 mb-4">
          Leaderboard Card
        </h2>
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {/* Without Rank */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              Without Rank Number
            </h3>
            <LeaderboardCard 
              name="John Doe"
              coinCount={20}
            />
          </div>

          {/* With Rank */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              With Rank Number
            </h3>
            <LeaderboardCard 
              rank={1}
              name="John Doe"
              coinCount={20}
              showRank={true}
            />
          </div>

          {/* List Items */}
          <div>
            <h3 className="text-sm font-sf-medium text-gray-600 mb-3">
              List Items (for leaderboard list)
            </h3>
            <div className="space-y-2 max-w-[400px]">
              <LeaderboardListItem rank={1} name="Alice Johnson" coinCount={150} />
              <LeaderboardListItem rank={2} name="Bob Smith" coinCount={120} />
              <LeaderboardListItem rank={3} name="Charlie Brown" coinCount={100} />
              <LeaderboardListItem rank={4} name="Diana Prince" coinCount={85} isHighlighted />
              <LeaderboardListItem rank={5} name="Edward Norton" coinCount={70} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
