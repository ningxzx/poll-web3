"use client";

import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import { VOTING_SYSTEM_ADDRESS, VOTING_SYSTEM_ABI } from "../config/contracts";
import { usePublicClient } from "wagmi";
import { Proposal } from "@/types";
import { message } from "antd";

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

interface VoteRecord {
  voted: boolean;
  optionIndex: number;
}

export function useVotingSystem() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { writeContractAsync } = useWriteContract();
  const [userVotes, setUserVotes] = useState<Record<number, VoteRecord>>({});

  // Get proposal count
  const { data: proposalCount, refetch: refetchProposalCount } = useReadContract({
    address: VOTING_SYSTEM_ADDRESS,
    abi: VOTING_SYSTEM_ABI,
    functionName: "proposalCount",
  });

  // Load vote records from localStorage when component mounts and when proposals change
  useEffect(() => {
    if (address && proposals.length > 0) {
      const savedVotes = localStorage.getItem(`votes_${address.toLowerCase()}`);
      if (savedVotes) {
        try {
          const parsedVotes = JSON.parse(savedVotes);
          // Only load votes for existing proposals
          const validVotes = Object.entries(parsedVotes).reduce(
            (acc, [id, voteData]) => {
              if (proposals.some((p) => p.id === Number(id))) {
                acc[Number(id)] = voteData as VoteRecord;
              }
              return acc;
            },
            {} as Record<number, VoteRecord>
          );
          setUserVotes(validVotes);
        } catch (error) {
          console.error("Error parsing saved votes:", error);
          localStorage.removeItem(`votes_${address.toLowerCase()}`);
        }
      }
    } else {
      setUserVotes({});
    }
  }, [address, proposals]);

  // Save vote record to localStorage
  const saveVoteRecord = (proposalId: number, optionIndex: number) => {
    if (!address) return;

    try {
      const savedVotes = localStorage.getItem(`votes_${address.toLowerCase()}`);
      const currentVotes = savedVotes ? JSON.parse(savedVotes) : {};
      const newVotes = {
        ...currentVotes,
        [proposalId]: { voted: true, optionIndex },
      };
      localStorage.setItem(
        `votes_${address.toLowerCase()}`,
        JSON.stringify(newVotes)
      );
      setUserVotes((prev) => ({
        ...prev,
        [proposalId]: { voted: true, optionIndex },
      }));
    } catch (error) {
      console.error("Error saving vote record:", error);
    }
  };

  // Fetch proposals whenever the count changes
  useEffect(() => {
    const fetchProposals = async () => {
      if (!publicClient) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        if (!proposalCount) {
          setProposals([]);
          setIsLoading(false);
          return;
        }

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
          coverImage: proposal[3],
          isCustomVoting: proposal[4],
          options: proposal[5].map((opt: any) => ({
            text: opt.text,
            votes: opt.votes,
          })),
        }));

        console.log("Fetched proposals:", formattedProposals);
        setProposals(formattedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [proposalCount, publicClient]);

  const handleCreateProposal = async (
    title: string,
    description: string = "",
    options: string[] = [],
    coverImage: string = ""
  ) => {
    if (!address || !publicClient) {
      throw new Error("Wallet not connected");
    }

    try {
      // Check for duplicate title
      const duplicateProposal = proposals.find(
        (p) => p.title.toLowerCase() === title.trim().toLowerCase()
      );
      if (duplicateProposal) {
        throw new Error("A proposal with this title already exists");
      }

      if (options.length > 0 && (options.length < 2 || options.length > 3)) {
        throw new Error("Custom voting must have 2-3 options");
      }

      console.log("Creating proposal with args:", {
        title: title.trim(),
        description: description.trim(),
        options,
        coverImage,
      });

      const hash = await writeContractAsync({
        address: VOTING_SYSTEM_ADDRESS,
        abi: VOTING_SYSTEM_ABI,
        functionName: "createProposal",
        args: [title.trim(), description.trim(), options, coverImage],
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

    // Check if user has already voted
    const voteRecord = userVotes[proposalId];
    if (voteRecord?.voted) {
      message.error("You have already voted on this proposal");
      throw new Error("You have already voted on this proposal");
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

      // Save vote record and update state
      saveVoteRecord(proposalId, optionIndex);
      setUserVotes((prev) => ({
        ...prev,
        [proposalId]: { voted: true, optionIndex },
      }));

      // 获取最新的提案数据
      const updatedProposalData = await publicClient.readContract({
        address: VOTING_SYSTEM_ADDRESS,
        abi: VOTING_SYSTEM_ABI,
        functionName: "getProposalDetails",
        args: [BigInt(proposalId)],
      });

      // 更新提案数据
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === proposalId) {
            return {
              ...p,
              options: updatedProposalData[5].map((opt: any) => ({
                text: opt.text,
                votes: opt.votes,
              })),
            };
          }
          return p;
        })
      );

      return receipt;
    } catch (error: any) {
      console.error("Error voting:", error);
      if (
        error?.message?.includes("Already voted") ||
        error?.data?.message?.includes("Already voted") ||
        error?.cause?.message?.includes("Already voted")
      ) {
        message.error("You have already voted on this proposal");
      }
      throw error;
    }
  };

  return {
    proposals,
    userVotes,
    isLoading,
    createProposal: handleCreateProposal,
    vote: handleVote,
  };
}
