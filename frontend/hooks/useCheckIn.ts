'use client';

import { useContractWrite, useContractRead, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { type Address, type Hash } from 'viem';
import { parseAbiItem } from 'viem';

// Contract configuration
const VOTING_TOKEN_ADDRESS = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e' as const;

const VOTING_TOKEN_ABI = [
  parseAbiItem('function checkIn() public'),
  parseAbiItem('function lastCheckIn(address) public view returns (uint256)'),
  parseAbiItem('function balanceOf(address) public view returns (uint256)')
] as const;

export function useCheckIn() {
  const { address: userAddress } = useAccount();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<number>(0);

  // Get the last check-in time
  const { data: lastCheckIn, refetch } = useContractRead({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: 'lastCheckIn',
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  // Check-in operation
  const { write: checkIn, isLoading, isSuccess } = useContractWrite({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: 'checkIn',
    onSuccess(data: { hash: Hash }) {
      toast.success('Check-in successful! You received tokens!');
      refetch();
    },
    onError(error) {
      console.error('Check-in error:', error);
      toast.error(error?.message || 'Failed to check in');
    },
  } as any);

  // Handle check-in
  const handleCheckIn = () => {
    if (!checkIn) {
      toast.error('Check-in function not available');
      return;
    }
    checkIn();
  };

  // Check if user can check in
  useEffect(() => {
    const checkCanCheckIn = () => {
      // lastCheckIn is bigint | undefined
      if (typeof lastCheckIn === 'undefined') {
        setCanCheckIn(true);
        return;
      }

      const lastCheckInTimestamp = Number(lastCheckIn) * 1000; // Convert to milliseconds
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;

      // lastCheckIn is bigint here
      setCanCheckIn(lastCheckIn === BigInt(0) || now >= lastCheckInTimestamp + oneDayInMs);
      setLastCheckInTime(Number(lastCheckIn));
    };

    checkCanCheckIn();
  }, [lastCheckIn]);

  return {
    checkIn: handleCheckIn,
    canCheckIn,
    isLoading,
    isSuccess,
    lastCheckInTime
  };
}
