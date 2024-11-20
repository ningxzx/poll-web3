'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useVotingSystem } from '../hooks/useVotingSystem';
import { useCheckIn } from '../hooks/useCheckIn';
import { useAccount } from 'wagmi';

export default function Home() {
  const { proposals, handleVote } = useVotingSystem();
  const { handleCheckIn, canCheckIn, isLoading } = useCheckIn();
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Voting DApp
            </h1>
            <div className="flex items-center space-x-4">
              {isConnected && (
                <button
                  onClick={handleCheckIn}
                  disabled={!canCheckIn || isLoading}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    canCheckIn
                      ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/20'
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/20'
                  }`}
                >
                  {isLoading ? '签到中...' : canCheckIn ? '每日签到' : '今日已签到'}
                </button>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-100 mb-2">Active Proposals</h2>
            <p className="text-gray-400">Vote on community proposals or create your own</p>
          </div>
          <Link
            href="/create"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
                     hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg 
                     hover:shadow-purple-500/25"
          >
            Create New Proposal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals?.map((proposal) => (
            <div key={proposal.id} className="gradient-border p-6 glass-effect rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100">{proposal.title}</h3>
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
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{option.text}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">
                            {Number(option.voteCount)} votes
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
                      <span>Yes Votes: {Number(proposal.options[0].voteCount)}</span>
                      <span>No Votes: {Number(proposal.options[1].voteCount)}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                        style={{ 
                          width: `${Math.round(
                            (Number(proposal.options[0].voteCount) / 
                            (Number(proposal.options[0].voteCount) + Number(proposal.options[1].voteCount) || 1)) * 100
                          )}%` 
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
      </main>
    </div>
  );
}
