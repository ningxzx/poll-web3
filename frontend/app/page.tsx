"use client";

import Link from 'next/link';
import { useVotingSystem } from "../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import NavBar from "./components/NavBar";

export default function Home() {
  const { proposals, vote } = useVotingSystem();
  const { isConnected } = useAccount();

  const handleVote = async (proposalId: number, optionIndex: number) => {
    try {
      await vote(proposalId, optionIndex);
    } catch (error: any) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />

      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h4 className="text-xl font-bold text-gray-100 my-2">
              Active Proposals
            </h4>
            <p className="text-gray-400">
              Vote on community proposals or create your own
            </p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">No proposals yet. Be the first to create one!</p>
            {isConnected ? (
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Create First Proposal
              </Link>
            ) : (
              <p className="text-sm text-gray-500">Connect your wallet to create proposals</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals?.map((proposal) => (
              <div
                key={proposal.id}
                className="gradient-border p-6 glass-effect rounded-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">
                      {proposal.title}
                    </h3>
                    <p className="mt-2 text-gray-400">{proposal.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20">
                    Active
                  </span>
                </div>

                <div className="mt-6">
                  {proposal.isCustomVoting ? (
                    <div className="space-y-3">
                      {proposal.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-300">{option.text}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">
                              {Number(option.votes)} votes
                            </span>
                            <button
                              onClick={() => handleVote(proposal.id, index)}
                              className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 
                                       hover:bg-purple-500/30 transition-colors duration-200 
                                       border border-purple-500/20"
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>
                          Yes Votes: {Number(proposal.options[0].votes)}
                        </span>
                        <span>No Votes: {Number(proposal.options[1].votes)}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{
                            width: `${Math.round(
                              (Number(proposal.options[0].votes) /
                                (Number(proposal.options[0].votes) +
                                  Number(proposal.options[1].votes) || 1)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          onClick={() => handleVote(proposal.id, 0)}
                          className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 
                                   transition-colors duration-200 border border-green-500/20"
                        >
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 1)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 
                                   transition-colors duration-200 border border-red-500/20"
                        >
                          Vote No
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
