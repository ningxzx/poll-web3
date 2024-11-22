"use client";

import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  http,
} from "wagmi";
import { useState, useEffect } from "react";
import { VOTING_SYSTEM_ADDRESS, VOTING_SYSTEM_ABI } from "../config/contracts";
import { usePublicClient } from "wagmi";
import { localhost } from "viem/chains";
import { config } from "../config/wagmi";

// Token costs configuration
export const TOKEN_COSTS = {
  CREATE_PROPOSAL: 5,
  INITIAL_BALANCE: 100,
  DAILY_CHECKIN: 5,
} as const;

interface Option {
  text: string;
  votes: bigint;
}

interface Proposal {
  id: number;
  creator: string;
  title: string;
  description: string;
  isCustomVoting: boolean;
  options: Option[];
}

export function useVotingSystem() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { writeContractAsync } = useWriteContract();

  console.log({ publicClient });

  // Get proposal count
  const { data: proposalCount, refetch: refetchProposalCount } =
    useReadContract({
      address: VOTING_SYSTEM_ADDRESS,
      abi: VOTING_SYSTEM_ABI,
      functionName: "proposalCount",
    });

  // Fetch proposals whenever the count changes
  useEffect(() => {
    const fetchProposals = async () => {
      if (!proposalCount || !publicClient) return;

      try {
        const count = Number(proposalCount);
        console.log("Fetching proposals. Count:", count);

        const proposalPromises = [];
        for (let i = 1; i <= count; i++) {
          proposalPromises.push(
            publicClient.readContract({
              address: VOTING_SYSTEM_ADDRESS,
              abi: VOTING_SYSTEM_ABI,
              functionName: "getProposalDetails",
              args: [BigInt(i)],
            })
          );
        }

        const results = await Promise.all(proposalPromises);
        const formattedProposals = results.map((proposal, index) => ({
          id: index + 1,
          creator: proposal[0],
          title: proposal[1],
          description: proposal[2],
          isCustomVoting: proposal[3],
          options: proposal[4].map((opt: any) => ({
            text: opt.text,
            votes: opt.votes,
          })),
        }));

        console.log("Fetched proposals:", formattedProposals);
        setProposals(formattedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [proposalCount, publicClient]);

  const handleCreateProposal = async (
    title: string,
    description: string = "",
    options: string[] = []
  ) => {
    if (!address || !publicClient) {
      throw new Error("Wallet not connected");
    }

    try {
      if (options.length > 0 && (options.length < 2 || options.length > 3)) {
        throw new Error("Custom voting must have 2-3 options");
      }

      console.log("Creating proposal with args:", {
        title: title.trim(),
        description: description.trim(),
        options,
      });

      const hash = await writeContractAsync({
        address: VOTING_SYSTEM_ADDRESS,
        abi: VOTING_SYSTEM_ABI,
        functionName: "createProposal",
        args: [title.trim(), description.trim(), options],
      } as any);

      console.log("Transaction hash:", hash);

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction receipt:", receipt);

      // Wait a moment for the blockchain to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refetch proposal count and proposals
      await refetchProposalCount();

      return receipt;
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  };

  const handleVote = async (proposalId: number, optionIndex: number) => {
    if (!address || !publicClient) {
      throw new Error("Wallet not connected");
    }

    try {
      const hash = await writeContractAsync({
        address: VOTING_SYSTEM_ADDRESS,
        abi: VOTING_SYSTEM_ABI,
        functionName: "vote",
        args: [BigInt(proposalId), BigInt(optionIndex)],
      } as any);

      console.log("Vote transaction hash:", hash);

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Vote transaction receipt:", receipt);

      // Wait a moment for the blockchain to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refetch proposal count and proposals
      await refetchProposalCount();
      return receipt;
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  };

  return {
    proposals,
    createProposal: handleCreateProposal,
    vote: handleVote,
  };
}
