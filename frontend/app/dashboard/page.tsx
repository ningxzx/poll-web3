"use client";

import { useVotingSystem } from "../../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import { TokenBalance } from "../components/TokenBalance";
import { useEffect, useState } from "react";
import { useCheckIn } from "../../hooks/useCheckIn";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  const { proposals } = useVotingSystem();
  const { address, isConnected } = useAccount();
  const { checkIn, canCheckIn, isLoading, isSuccess, dailyReward } = useCheckIn();

  const [userStats, setUserStats] = useState({
    totalVotes: 0,
    participationRate: 0,
  });

  useEffect(() => {
    setUserStats({
      totalVotes: 12,
      participationRate: 75,
    });
  }, []);

  return (
    <div className="min-h-screen pt-2">
      <NavBar />
      <div className="max-w-7xl mx-auto mt-20">
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <TokenBalance />
              <button
                onClick={checkIn}
                disabled={!canCheckIn || isLoading}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  canCheckIn
                    ? "bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/20"
                    : "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/20"
                }`}
              >
                {isLoading
                  ? "Checking in..."
                  : canCheckIn
                  ? `Daily Check-in (+${dailyReward} tokens)`
                  : "Already Checked In"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h3 className="text-lg font-semibold text-purple-300">Token Usage</h3>
                <p className="text-gray-400">Create Proposal Cost: 5 tokens</p>
                <p className="text-gray-400">Daily Check-in Reward: {dailyReward} tokens</p>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h3 className="text-lg font-semibold text-purple-300">Voting Stats</h3>
                <p className="text-gray-400">Total Votes: {userStats.totalVotes}</p>
                <p className="text-gray-400">Participation Rate: {userStats.participationRate}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Please connect your wallet to view your dashboard
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Active Proposals</h2>
          {proposals && proposals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {proposal.title}
                  </h3>
                  <p className="text-gray-400">{proposal.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No active proposals</p>
          )}
        </div>
      </div>
    </div>
  );
}
