"use client";

import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { VOTING_TOKEN_ADDRESS, VOTING_TOKEN_ABI } from "../config/contracts";
import { formatEther } from "viem";

export function useTokenBalance() {
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState<string>("0");

  const { data: tokenBalance, refetch, isLoading } = useReadContract({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
  });

  useEffect(() => {
    if (tokenBalance !== undefined) {
      // Convert from wei to VOTC and format to 0 decimal places
      const formattedBalance = Number(formatEther(tokenBalance)).toFixed(0);
      setBalance(formattedBalance);
    }
  }, [tokenBalance]);

  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener('REFRESH_BALANCE', handleRefresh);
    return () => {
      window.removeEventListener('REFRESH_BALANCE', handleRefresh);
    };
  }, [refetch]);

  return {
    balance,
    isLoading,
    refetchBalance: refetch,
  };
}
