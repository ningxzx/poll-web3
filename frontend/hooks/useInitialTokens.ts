"use client";

import { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { VOTING_TOKEN_ADDRESS, VOTING_TOKEN_ABI } from "../config/contracts";
import toast from "react-hot-toast";

export function useInitialTokens() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: balance } = useReadContract({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    const getInitialTokens = async () => {
      if (!address || balance === undefined || Number(balance) > 0) return;

      try {
        const hash = await writeContractAsync({
          address: VOTING_TOKEN_ADDRESS,
          abi: VOTING_TOKEN_ABI,
          functionName: "getInitialTokens",
        } as any);

        if (hash) {
          toast.success("Welcome! You received 100 initial tokens!");
          window.dispatchEvent(new Event('REFRESH_BALANCE'));
        }
      } catch (error: any) {
        console.error("Error getting initial tokens:", error);
        toast.error(error.message || "Failed to get initial tokens");
      }
    };

    getInitialTokens();
  }, [address, balance, writeContractAsync]);
}
