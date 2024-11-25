export const VOTING_SYSTEM_ADDRESS = '0x3569A8c1f4aACcE7A028a8Ee63857998eA1A9C7b';
export const VOTING_TOKEN_ADDRESS = '0x484614EBE3921185E2010E526E4a5875658997F0';

export const VOTING_SYSTEM_ABI = [
  {
    inputs: [
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_options", type: "string[]" },
      { name: "_coverImage", type: "string" }
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
      { name: "coverImage", type: "string" },
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
  },
  {
    inputs: [
      { name: "_proposalId", type: "uint256" },
      { name: "_voter", type: "address" }
    ],
    name: "hasVoted",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

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
  },
  {
    inputs: [],
    name: "getInitialTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
