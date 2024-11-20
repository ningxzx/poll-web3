'use client';

import { useContractWrite, useContractRead } from 'wagmi';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const VOTING_TOKEN_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

const VOTING_TOKEN_ABI = [
  "function checkIn() external",
  "function lastCheckIn(address) external view returns (uint256)",
  "function balanceOf(address) external view returns (uint256)"
];

export function useCheckIn() {
  const { address: userAddress } = useAccount();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<number>(0);

  // 获取上次签到时间
  const { data: lastCheckIn } = useContractRead({
    address: VOTING_TOKEN_ADDRESS as `0x${string}`,
    abi: VOTING_TOKEN_ABI,
    functionName: 'lastCheckIn',
    args: [userAddress],
    enabled: !!userAddress,
    watch: true,
  });

  // 签到操作
  const { write: checkIn, isLoading, isSuccess } = useContractWrite({
    address: VOTING_TOKEN_ADDRESS as `0x${string}`,
    abi: VOTING_TOKEN_ABI,
    functionName: 'checkIn',
  });

  // 检查是否可以签到
  useEffect(() => {
    if (lastCheckIn) {
      const lastCheckInDate = new Date(Number(lastCheckIn) * 1000);
      const now = new Date();
      
      // 如果是新的一天或从未签到过，则可以签到
      setCanCheckIn(
        lastCheckIn === 0n || 
        lastCheckInDate.getDate() !== now.getDate() ||
        lastCheckInDate.getMonth() !== now.getMonth() ||
        lastCheckInDate.getFullYear() !== now.getFullYear()
      );
      setLastCheckInTime(Number(lastCheckIn));
    }
  }, [lastCheckIn]);

  const handleCheckIn = async () => {
    try {
      await checkIn?.();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  return {
    handleCheckIn,
    canCheckIn,
    isLoading,
    isSuccess,
    lastCheckInTime
  };
}
