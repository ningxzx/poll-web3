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
  projectId: "vote-for-fun",
  chains: [
    mainnet,
    linea,
    lineaSepolia,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    localhost,
  ] as any,
});
