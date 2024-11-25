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
  projectId: "7d8f3e8a7f8c4b3f9b2a1d5e6c4b3f9b", // Get from https://cloud.walletconnect.com
  chains: [
    lineaSepolia,
    localhost,
  ],
  ssr: true,
});
