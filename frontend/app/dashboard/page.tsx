"use client";

import { useAccount } from "wagmi";
import { TokenBalance } from "../components/TokenBalance";
import { Tabs } from "../components/Tabs";
import NavBar from "../components/NavBar";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useCheckIn } from "../../hooks/useCheckIn";
import { useInitialTokens } from "../../hooks/useInitialTokens";
import { useVotingSystem } from "../../hooks/useVotingSystem";
import Link from "next/link";
import { useMemo } from "react";

export default function Dashboard() {
  const { address } = useAccount();
  const { balance } = useTokenBalance();
  const { checkIn, isLoading: isCheckingIn, canCheckIn } = useCheckIn();
  const { proposals, userVotes } = useVotingSystem();
  useInitialTokens();

  // 获取用户创建的提案
  const userProposals = useMemo(() => {
    if (!address) return [];
    return proposals.filter(
      (proposal) => proposal.creator.toLowerCase() === address.toLowerCase()
    );
  }, [proposals, address]);

  // 获取用户投票过的提案
  const votedProposals = useMemo(() => {
    return proposals.filter((proposal) => userVotes[proposal.id]?.voted);
  }, [proposals, userVotes]);

  const tabs = [
    {
      id: "voted",
      label: "My Votes",
      content: (
        <div className="p-4">
          {votedProposals.length === 0 ? (
            <p className="text-gray-500 mt-1">You haven't voted on any proposals yet</p>
          ) : (
            <div className="mt-4 space-y-4">
              {votedProposals.map((proposal) => {
                const voteData = userVotes[proposal.id];
                const selectedOption = proposal.options[voteData.optionIndex];
                return (
                  <div
                    key={proposal.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                  >
                    <h4 className="text-lg font-medium text-gray-200">{proposal.title}</h4>
                    <p className="text-gray-400 mt-2">{proposal.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-purple-400">
                        Your vote: {selectedOption.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "created",
      label: "My Proposals",
      content: (
        <div className="p-4">
          {userProposals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any proposals yet</p>
              <Link
                href="/create"
                className="text-purple-400 hover:text-purple-300"
              >
                Create your first proposal →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {userProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                >
                  <h4 className="text-lg font-medium text-gray-200">{proposal.title}</h4>
                  <p className="text-gray-400 mt-2">{proposal.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Total Votes: {proposal.options.reduce((acc, opt) => acc + Number(opt.votes), 0)}
                    </div>
                    <Link
                      href="/"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "history",
      label: "Token History",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-medium">Token History</h3>
          {/* TODO: Add token history list */}
          <p className="text-gray-500">No token history</p>
        </div>
      ),
    },
  ];

  if (!address) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Please connect your wallet first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />

      {/* Main Container with Side Padding */}
      <div className="container mx-auto px-8 py-6 pt-24">
        {/* Token Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-200">Token Balance</h3>
              <div className="p-2 bg-gray-700/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <TokenBalance />
          </div>

          {/* Daily Check-in Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-200">Daily Rewards</h3>
              <div className="p-2 bg-gray-700/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={checkIn}
              disabled={isCheckingIn || !canCheckIn}
              className={`
                w-full px-4 py-3 rounded-xl text-white font-medium transition-all
                ${
                  isCheckingIn || !canCheckIn
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md"
                }
              `}
            >
              {isCheckingIn ? "Checking in..." : canCheckIn ? "Daily Check-in" : "Already Checked In"}
            </button>
          </div>

        </div>

        {/* Tabs Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
}
