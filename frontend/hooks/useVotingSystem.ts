'use client';

import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useState, useEffect } from 'react';

// Import your contract ABI and address
const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const CONTRACT_ABI = [
  "function createProposal(string memory _title, string memory _description) public",
  "function vote(uint256 _proposalId, bool _support) public",
  "function getProposals() public view returns (tuple(uint256 id, string title, string description, uint256 yesVotes, uint256 noVotes, bool executed, address proposer)[] memory)"
];

export function useVotingSystem() {
  const [proposals, setProposals] = useState([]);

  // Read proposals
  const { data: proposalsData } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getProposals',
  });

  // Create proposal
  const { config: createProposalConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'createProposal',
  });

  const { write: createProposal } = useContractWrite(createProposalConfig);

  // Vote on proposal
  const { config: voteConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'vote',
  });

  const { write: vote } = useContractWrite(voteConfig);

  useEffect(() => {
    if (proposalsData) {
      setProposals(proposalsData);
    }
  }, [proposalsData]);

  return {
    proposals,
    createProposal,
    vote,
  };
}
