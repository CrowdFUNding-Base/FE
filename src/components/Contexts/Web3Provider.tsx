'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { OnchainKitProvider } from '@coinbase/onchainkit';

import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';

import { PrivyProvider } from '@privy-io/react-auth';

// ... imports

const config = getDefaultConfig({
  appName: 'CrowdFUNding',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base, baseSepolia, mainnet, sepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

type Web3ProviderProps = {
  children: ReactNode;
};

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <PrivyProvider
      appId="clpispdty00y6mc0fv71a17xs" // Placeholder App ID - Replace with Env Var later
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={lightTheme({
              accentColor: '#007AFF',
              accentColorForeground: 'white',
              borderRadius: 'large',
              fontStack: 'system',
            })}
            modalSize="compact"
          >
            <OnchainKitProvider chain={base}>
              {children}
            </OnchainKitProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
