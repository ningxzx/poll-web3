'use client';

import { useContractRead, useWalletClient, useNetwork, usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { publicClient } from '../config/wagmi';
import { VOTING_SYSTEM_ADDRESS, VOTING_SYSTEM_ABI } from '../config/contracts';
import { hardhat } from 'wagmi/chains';

interface Option {
  text: string;
  votes: bigint;
}

interface Proposal {
  id: number;
  creator: string;
  title: string;
  description: string;
  isCustomVoting: boolean;
  options: Option[];
}

export function useVotingSystem() {
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const wagmiPublicClient = usePublicClient();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // 检查网络连接
  const checkNetwork = () => {
    if (!chain) {
      throw new Error('Please connect to a network');
    }

    if (chain.id !== hardhat.id) {
      throw new Error('Please connect to Hardhat network (localhost:8545)');
    }
  };

  // 获取提案总数
  const { data: proposalCount } = useContractRead({
    address: VOTING_SYSTEM_ADDRESS as `0x${string}`,
    abi: VOTING_SYSTEM_ABI,
    functionName: 'proposalCount',
    watch: true,
  });

  // 获取所有提案详情
  useEffect(() => {
    const fetchProposals = async () => {
      if (!proposalCount) return;

      try {
        checkNetwork();

        const proposalsData: Proposal[] = [];
        for (let i = 0; i < Number(proposalCount); i++) {
          try {
            const proposal = await publicClient.readContract({
              address: VOTING_SYSTEM_ADDRESS as `0x${string}`,
              abi: VOTING_SYSTEM_ABI,
              functionName: 'getProposalDetails',
              args: [BigInt(i)]
            });

            if (proposal) {
              proposalsData.push({
                id: i,
                creator: proposal[0],
                title: proposal[1],
                description: proposal[2],
                isCustomVoting: proposal[3],
                options: proposal[4].map((opt: { text: string; votes: bigint }) => ({
                  text: opt.text,
                  votes: opt.votes
                }))
              });
            }
          } catch (error) {
            console.error(`Error fetching proposal ${i}:`, error);
          }
        }
        setProposals(proposalsData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, [proposalCount, chain]);

  const handleCreateProposal = async (
    title: string, 
    description: string = '',
    options: string[] = []
  ) => {
    if (!walletClient || !wagmiPublicClient) {
      throw new Error('Wallet not connected');
    }

    // 检查网络连接
    checkNetwork();

    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }

    // 如果没有提供选项，则使用默认的 Yes/No 选项
    let finalOptions = options.filter(opt => opt.trim() !== '');
    if (finalOptions.length === 0) {
      finalOptions = ['Yes', 'No'];
    } else if (finalOptions.length < 2 || finalOptions.length > 3) {
      throw new Error('Custom voting must have 2-3 options');
    }

    try {
      console.log('Creating proposal with:', {
        title: title.trim(),
        description: description.trim(),
        options: finalOptions,
        address: VOTING_SYSTEM_ADDRESS,
        account: walletClient.account,
        chainId: chain?.id
      });

      // 准备合约调用参数
      const hash = await walletClient.writeContract({
        address: VOTING_SYSTEM_ADDRESS as `0x${string}`,
        abi: VOTING_SYSTEM_ABI,
        functionName: 'createProposal',
        args: [title.trim(), description.trim(), finalOptions],
        account: walletClient.account,
        chain
      });

      console.log('Transaction hash:', hash);

      // 等待交易被确认
      const receipt = await wagmiPublicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
        timeout: 60_000, // 60 seconds
      });

      console.log('Transaction receipt:', receipt);
      return receipt;
    } catch (error: any) {
      console.error('Error creating proposal:', {
        error,
        message: error.message,
        details: error.details,
        code: error.code,
        data: error.data,
        transaction: error.transaction,
        receipt: error.receipt
      });
      throw error;
    }
  };

  const handleVote = async (proposalId: number, optionIndex: number) => {
    if (!walletClient || !wagmiPublicClient) {
      throw new Error('Wallet not connected');
    }

    // 检查网络连接
    checkNetwork();

    try {
      const hash = await walletClient.writeContract({
        address: VOTING_SYSTEM_ADDRESS as `0x${string}`,
        abi: VOTING_SYSTEM_ABI,
        functionName: 'vote',
        args: [BigInt(proposalId), BigInt(optionIndex)],
        account: walletClient.account,
        chain
      });

      const receipt = await wagmiPublicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
        timeout: 60_000
      });
      console.log('Vote transaction receipt:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  const handleEvaluate = async (proposalId: number, rating: number) => {
    if (!walletClient || !wagmiPublicClient) {
      throw new Error('Wallet not connected');
    }

    // 检查网络连接
    checkNetwork();

    try {
      const hash = await walletClient.writeContract({
        address: VOTING_SYSTEM_ADDRESS as `0x${string}`,
        abi: VOTING_SYSTEM_ABI,
        functionName: 'evaluateProposal',
        args: [BigInt(proposalId), rating],
        account: walletClient.account,
        chain
      });

      const receipt = await wagmiPublicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
        timeout: 60_000
      });
      console.log('Evaluation transaction receipt:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error evaluating:', error);
      throw error;
    }
  };

  return {
    proposals,
    handleCreateProposal,
    handleVote,
    handleEvaluate,
  };
}
