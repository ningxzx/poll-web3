"use client";

import {
  useContractRead,
  useAccount,
  useWriteContract,
  useSimulateContract,
  useReadContract,
} from "wagmi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { type Address, type Hash, parseAbiItem } from "viem";
import { VOTING_TOKEN_ADDRESS, VOTING_TOKEN_ABI } from "../config/contracts";

const DAILY_CHECKIN_REWARD = 10; // Daily check-in reward amount
const ONE_DAY = 24 * 60 * 60 * 1000;

export function useCheckIn() {
  const { address } = useAccount();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { writeContractAsync } = useWriteContract();

  // Get the last check-in time
  const { data: lastCheckIn, refetch, isLoading } = useReadContract({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "lastCheckIn",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const checkCanCheckIn = () => {
    if (!lastCheckIn) return;

    const lastCheckInDate = new Date(Number(lastCheckIn) * 1000);
    const now = new Date();
    const timeDiff = now.getTime() - lastCheckInDate.getTime();
    setCanCheckIn(timeDiff >= ONE_DAY);
    setLastCheckInTime(Number(lastCheckIn));
    setIsInitialized(true);
  };

  const handleCheckIn = async () => {
    if (!address || !canCheckIn) {
      toast.error("Check-in not available");
      return;
    }

    try {
      setIsCheckingIn(true);
      const hash = await writeContractAsync({
        address: VOTING_TOKEN_ADDRESS,
        abi: VOTING_TOKEN_ABI,
        functionName: "checkIn",
      } as any);

      if (hash) {
        toast.success("Check-in successful!");
        await refetch();
        // 触发 balance 更新
        window.dispatchEvent(new Event('REFRESH_BALANCE'));
        setCanCheckIn(false);
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error("Check-in failed");
    } finally {
      setIsCheckingIn(false);
    }
  };

  useEffect(() => {
    checkCanCheckIn();
  }, [lastCheckIn]);

  return {
    canCheckIn,
    isLoading,
    lastCheckInTime,
    checkIn: handleCheckIn,
    isInitialized,
    dailyReward: DAILY_CHECKIN_REWARD,
    isCheckingIn
  };
}
