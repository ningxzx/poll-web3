'use client';

import { useTokenBalance } from '../../hooks/useTokenBalance';

export function TokenBalance() {
  const { balance, isLoading } = useTokenBalance();

  return (
    <div className="flex flex-col">
      <div className="text-4xl font-bold text-gray-100 mb-2">
        {isLoading ? "..." : balance}
      </div>
      <div className="text-gray-400 text-sm">
        VOTC Tokens
      </div>
    </div>
  );
}
