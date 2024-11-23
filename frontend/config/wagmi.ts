import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  linea,
  lineaSepolia,
  localhost,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "vote-for-fun",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // Get from https://cloud.walletconnect.com
  chains: [
    lineaSepolia,
    localhost,
  ],
  ssr: true,
});
