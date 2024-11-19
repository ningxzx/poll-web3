'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useVotingSystem } from '../hooks/useVotingSystem';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Voting DApp
            </h1>
            <ConnectButton />
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
          {/* Sample Proposal Card */}
          <div className="gradient-border p-6 glass-effect rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">Sample Proposal Title</h3>
                <p className="mt-2 text-gray-400">
                  This is a sample proposal description. Real proposals will be loaded from the smart contract.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20">
                Active
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Yes Votes: 25</span>
                <span>No Votes: 10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  style={{ width: '71.4%' }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 
                               transition-colors duration-200 border border-green-500/20">
                Vote Yes
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 
                               transition-colors duration-200 border border-red-500/20">
                Vote No
              </button>
            </div>
          </div>

          {/* Additional Sample Card */}
          <div className="gradient-border p-6 glass-effect rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">Community Development Fund</h3>
                <p className="mt-2 text-gray-400">
                  Proposal to allocate funds for community development initiatives and educational programs.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/20">
                Passed
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Yes Votes: 156</span>
                <span>No Votes: 23</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500" 
                  style={{ width: '87%' }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button disabled className="px-4 py-2 rounded-lg bg-gray-700/50 text-gray-400 cursor-not-allowed">
                Voting Ended
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
