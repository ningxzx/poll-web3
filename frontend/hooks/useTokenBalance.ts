'use client';

import { useContractRead } from 'wagmi';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';

const VOTING_TOKEN_ADDRESS = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';

const VOTING_TOKEN_ABI = [
  {
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export function useTokenBalance() {
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState<string>('0');

  const { data: tokenBalance, refetch } = useContractRead({
    address: VOTING_TOKEN_ADDRESS as `0x${string}`,
    abi: VOTING_TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
    watch: true,
  });

  useEffect(() => {
    if (tokenBalance !== undefined) {
      setBalance(formatEther(tokenBalance));
    }
  }, [tokenBalance]);

  return {
    balance,
    refetchBalance: refetch
  };
}
