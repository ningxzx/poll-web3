'use client';

import { useTokenBalance } from '../../hooks/useTokenBalance';

export function TokenBalance() {
  const { balance } = useTokenBalance();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-lg">
      <span>Token Balance:</span>
      <span className="font-bold">{balance}</span>
    </div>
  );
}
