"use client";

import { useAccount } from "wagmi";
import { TokenBalance } from "../components/TokenBalance";
import { Tabs } from "../components/Tabs";
import NavBar from "../components/NavBar";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useCheckIn } from "../../hooks/useCheckIn";
import { useInitialTokens } from "../../hooks/useInitialTokens";

export default function Dashboard() {
  const { address } = useAccount();
  const { balance } = useTokenBalance();
  const { checkIn, isLoading: isCheckingIn } = useCheckIn();
  useInitialTokens();

  const tabs = [
    {
      id: "voting",
      label: "Voting List",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-medium">Available Proposals</h3>
          {/* TODO: Add voting proposals list */}
          <p className="text-gray-500">No available proposals</p>
        </div>
      ),
    },
    {
      id: "created",
      label: "My Proposals",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-medium">My Created Proposals</h3>
          {/* TODO: Add created proposals list */}
          <p className="text-gray-500">No created proposals</p>
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
              disabled={isCheckingIn}
              className={`
                w-full px-4 py-3 rounded-xl text-white font-medium transition-all
                ${
                  isCheckingIn
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md"
                }
              `}
            >
              {isCheckingIn ? "Checking in..." : "Daily Check-in"}
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
