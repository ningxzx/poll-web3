import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  lineaSepolia,
  localhost,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Voting DApp',
  projectId: '7d8f3e8a7f8c4b3f9b2a1d5e6c4b3f9b',
  chains: [
    lineaSepolia,
    localhost,
  ],
  ssr: true,
});
