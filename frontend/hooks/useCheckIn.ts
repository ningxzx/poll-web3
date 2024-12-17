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
import { VOTING_TOKEN_ADDRESS, VOTING_TOKEN_ABI } from "../config/contracts";

const DAILY_CHECKIN_REWARD = 10;
const ONE_DAY_SECONDS = 24 * 60 * 60;

export function useCheckIn() {
  const { address } = useAccount();
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { writeContractAsync } = useWriteContract();

  // 获取上次签到时间
  const { data: lastCheckIn, refetch } = useReadContract({
    address: VOTING_TOKEN_ADDRESS,
    abi: VOTING_TOKEN_ABI,
    functionName: "lastCheckIn",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });


  // 检查是否可以签到
  useEffect(() => {
    const checkCanCheckIn = async () => {
      if (!address || lastCheckIn === undefined) return;

      const lastCheckInValue = Number(lastCheckIn);
      console.log('Last check-in value:', lastCheckInValue);

      // 如果从未签到过（lastCheckIn 为 0），允许签到
      if (BigInt(lastCheckInValue) === BigInt(0)) {
        console.log('First time check-in');
        setCanCheckIn(true);
        return;
      }

      // 获取当前区块时间
      const currentTime = Math.floor(Date.now() / 1000);
      const timeSinceLastCheckIn = currentTime - lastCheckInValue;

      console.log('Check-in debug:', {
        lastCheckInTime: lastCheckInValue,
        currentTime,
        timeSinceLastCheckIn,
        canCheckIn: timeSinceLastCheckIn >= ONE_DAY_SECONDS
      });

      setCanCheckIn(timeSinceLastCheckIn >= ONE_DAY_SECONDS);
    };

    checkCanCheckIn();
  }, [address, lastCheckIn]);

  // 签到函数
  const handleCheckIn = async () => {
    if (!address || !canCheckIn) {
      toast.error("签到不可用");
      return;
    }

    try {
      setIsCheckingIn(true);
      
      // 使用预估的 gas 配置
      const hash = await writeContractAsync({
        address: VOTING_TOKEN_ADDRESS!,
        abi: VOTING_TOKEN_ABI!,
        functionName: "checkIn",
      });

      if (hash) {
        toast.success("签到成功！");
        await refetch();
        window.dispatchEvent(new Event('REFRESH_BALANCE'));
        setCanCheckIn(false);
      }
    } catch (error: any) {
      console.error("签到失败:", error);
      toast.error(error?.message || "签到失败");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    canCheckIn,
    checkIn: handleCheckIn,
    isCheckingIn,
    dailyReward: DAILY_CHECKIN_REWARD
  };
}
