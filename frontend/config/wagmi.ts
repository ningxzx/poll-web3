import { createConfig, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { createPublicClient, http } from 'viem';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

// 配置 Hardhat 本地网络
const hardhatChain = {
  ...hardhat,
  rpcUrls: {
    ...hardhat.rpcUrls,
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

const { chains, publicClient: wagmiPublicClient } = configureChains(
  [hardhatChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'http://127.0.0.1:8545',
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Voting DApp',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient: wagmiPublicClient,
});

// 用于直接的合约调用
export const publicClient = createPublicClient({
  chain: hardhatChain,
  transport: http('http://127.0.0.1:8545'),
});
