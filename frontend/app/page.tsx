"use client";

import { useVotingSystem } from "../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import NavBar from "./components/NavBar";
import { message } from "antd";
import { useState, useMemo } from "react";
import ProposalCard from "./components/ProposalCard";
import Link from "next/link";
import NoSsr from "./components/NoSsr";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { proposals, userVotes, vote, isLoading } = useVotingSystem();
  const [votingStates, setVotingStates] = useState<Record<number, boolean>>({});

  const handleVote = async (proposalId: number, optionIndex: number) => {
    try {
      setVotingStates((prev) => ({ ...prev, [proposalId]: true }));
      await vote(proposalId, optionIndex);
      message.success("Vote submitted successfully!");
    } catch (error: any) {
      console.error("Error voting:", error);
      if (error.message.includes("User denied")) {
        message.info("Transaction cancelled by user");
      } else {
        message.error(error.message || "Failed to submit vote");
      }
    } finally {
      setVotingStates((prev) => ({ ...prev, [proposalId]: false }));
    }
  };

  // 对提案进行排序
  const sortedProposals = useMemo(() => {
    return [...proposals].sort((a, b) => {
      const totalVotesA = a.options.reduce(
        (sum, option) => sum + Number(option.votes),
        0
      );
      const totalVotesB = b.options.reduce(
        (sum, option) => sum + Number(option.votes),
        0
      );
      return totalVotesB - totalVotesA;
    });
  }, [proposals]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NoSsr>
        <NavBar />
      </NoSsr>

      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h4 className="text-xl font-bold text-gray-100 my-2">
              Hot Proposals
            </h4>
            <p className="text-gray-400">
              Vote on the proposals that matter to you
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedProposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">
              No proposals yet. Be the first to create one!
            </p>
            {isConnected ? (
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create First Proposal
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Connect your wallet to create proposals
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                userVotes={userVotes}
                isConnected={isConnected}
                onVote={handleVote}
                proposal={proposal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
