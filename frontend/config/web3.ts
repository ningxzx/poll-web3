import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [hardhat, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Voting DApp',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
