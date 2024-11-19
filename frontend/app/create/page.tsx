'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function CreateProposal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement proposal creation
    console.log('Creating proposal:', { title, description });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/" 
              className="text-gray-200 hover:text-white flex items-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Proposals
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <div className="gradient-border p-8 glass-effect rounded-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
            Create New Proposal
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Proposal Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="Enter a clear, concise title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="Provide a detailed description of your proposal"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
                         hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg 
                         hover:shadow-purple-500/25"
              >
                Create Proposal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
