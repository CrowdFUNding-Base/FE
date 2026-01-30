'use client';

import { ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { OnchainKitProvider } from '@coinbase/onchainkit';

import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';

// Create wagmi config outside component to prevent recreation
const config = getDefaultConfig({
  appName: 'CrowdFUNding',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [baseSepolia],
  ssr: true,
});

type Web3ProviderProps = {
  children: ReactNode;
};

export default function Web3Provider({ children }: Web3ProviderProps) {
  // Use useState to ensure QueryClient is stable across re-renders
  // This prevents wallet disconnection during navigation/interactions
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent refetching on window focus which can cause state issues
            refetchOnWindowFocus: false,
            // Increase stale time to reduce unnecessary refetches
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Retry failed queries
            retry: 2,
          },
        },
      })
  );

  return (
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
          <OnchainKitProvider chain={baseSepolia}>
            {children}
          </OnchainKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
