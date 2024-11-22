"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";
import { VOTING_TOKEN_ADDRESS } from "../config/contracts";
import { readContract } from "@wagmi/core";
import { config } from "../config/wagmi";

const VOTING_TOKEN_ABI = [
  parseAbiItem("function balanceOf(address) public view returns (uint256)"),
] as const;

export function useTokenBalance() {
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState<string>("0");

  const tokenBalance = readContract(config, {
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
  });

  useEffect(() => {
    if (tokenBalance !== undefined) {
      // Convert from wei (18 decimals) to token amount
      const tokenAmount = Number(tokenBalance) / 10 ** 18;
      setBalance(tokenAmount.toString());
    }
  }, [tokenBalance]);

  return {
    balance,
  };
}
