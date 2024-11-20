import fs from 'fs';
import path from 'path';

async function main() {
  // 从部署日志中读取最新的合约地址
  const deployLogs = fs.readFileSync('deployment-logs.txt', 'utf8');
  const votingTokenMatch = deployLogs.match(/VotingToken deployed to: (0x[a-fA-F0-9]{40})/);
  const votingSystemMatch = deployLogs.match(/VotingSystem deployed to: (0x[a-fA-F0-9]{40})/);

  if (!votingTokenMatch || !votingSystemMatch) {
    throw new Error('Could not find contract addresses in deployment logs');
  }

  const votingTokenAddress = votingTokenMatch[1];
  const votingSystemAddress = votingSystemMatch[1];

  // 更新前端配置文件
  const configContent = `export const VOTING_SYSTEM_ADDRESS = '${votingSystemAddress}';
export const VOTING_TOKEN_ADDRESS = '${votingTokenAddress}';

export const VOTING_SYSTEM_ABI = [
  {
    inputs: [
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_options", type: "string[]" }
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_proposalId", type: "uint256" },
      { name: "_optionIndex", type: "uint256" }
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_proposalId", type: "uint256" },
      { name: "_rating", type: "int8" }
    ],
    name: "evaluateProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "_proposalId", type: "uint256" }],
    name: "getProposalDetails",
    outputs: [
      { name: "creator", type: "address" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "isCustomVoting", type: "bool" },
      {
        components: [
          { name: "text", type: "string" },
          { name: "votes", type: "uint256" }
        ],
        name: "options",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];

export const VOTING_TOKEN_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "lastCheckIn",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];
`;

  const frontendConfigPath = path.join(__dirname, '../frontend/config/contracts.ts');
  fs.writeFileSync(frontendConfigPath, configContent);
  console.log('Frontend contract addresses updated successfully');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
