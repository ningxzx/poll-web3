"use client";

import {
  useContractRead,
  useAccount,
  useWriteContract,
  useSimulateContract,
} from "wagmi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { type Address, type Hash, parseAbiItem } from "viem";
import { VOTING_TOKEN_ADDRESS } from "../config/contracts";

const INITIAL_TOKEN_AMOUNT = 100; // Initial token amount for new users
const DAILY_CHECKIN_REWARD = 5; // Daily check-in reward amount

const VOTING_TOKEN_ABI = [
  parseAbiItem("function checkIn() public"),
  parseAbiItem("function lastCheckIn(address) public view returns (uint256)"),
  parseAbiItem("function balanceOf(address) public view returns (uint256)"),
  parseAbiItem("function mint(address to, uint256 amount) public"),
] as const;

export function useCheckIn() {
  const { address } = useAccount();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { writeContractAsync } = useWriteContract();

  // Get the last check-in time
  const { data: lastCheckIn, refetch } = useContractRead({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "lastCheckIn",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Handle check-in
  const handleCheckIn = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: VOTING_TOKEN_ADDRESS,
        abi: VOTING_TOKEN_ABI,
        functionName: "checkIn",
      } as any);

      toast.success(
        `Check-in successful! You received ${DAILY_CHECKIN_REWARD} tokens!`
      );
      await refetch();
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error(error?.message || "Failed to check in");
    }
  };

  // Check if user can check in (once per day)
  useEffect(() => {
    const checkCanCheckIn = () => {
      if (lastCheckIn === undefined) return;

      const lastCheckInDate = new Date(Number(lastCheckIn) * 1000);
      const now = new Date();
      const diffInHours =
        (now.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60);

      setLastCheckInTime(Number(lastCheckIn));
      setCanCheckIn(diffInHours >= 24);
    };

    checkCanCheckIn();
  }, [lastCheckIn]);

  return {
    canCheckIn,
    lastCheckInTime,
    checkIn: handleCheckIn,
    isInitialized,
  };
}
