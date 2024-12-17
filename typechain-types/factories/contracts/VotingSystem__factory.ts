/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  VotingSystem,
  VotingSystemInterface,
} from "../../contracts/VotingSystem";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "evaluator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int8",
        name: "rating",
        type: "int8",
      },
    ],
    name: "Evaluated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isCustomVoting",
        type: "bool",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "optionIndex",
        type: "uint256",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_options",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_coverImage",
        type: "string",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "int8",
        name: "_rating",
        type: "int8",
      },
    ],
    name: "evaluateProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getProposalDetails",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "coverImage",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isCustomVoting",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "votes",
            type: "uint256",
          },
        ],
        internalType: "struct VotingSystem.Option[]",
        name: "options",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "coverImage",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isCustomVoting",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_optionIndex",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "votingToken",
    outputs: [
      {
        internalType: "contract VotingToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200294f3803806200294f8339818101604052810190620000379190620000e8565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506200011a565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620000b08262000083565b9050919050565b620000c281620000a3565b8114620000ce57600080fd5b50565b600081519050620000e281620000b7565b92915050565b6000602082840312156200010157620001006200007e565b5b60006200011184828501620000d1565b91505092915050565b612825806200012a6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806387d5966b1161005b57806387d5966b14610108578063b034012314610124578063b384abef14610142578063da35c6641461015e5761007d565b8063013cf08b1461008257806302d84bdd146100b75780633b4d01a7146100d3575b600080fd5b61009c6004803603810190610097919061180c565b61017c565b6040516100ae96959493929190611925565b60405180910390f35b6100d160048036038101906100cc91906119d4565b61038a565b005b6100ed60048036038101906100e8919061180c565b610783565b6040516100ff96959493929190611b6c565b60405180910390f35b610122600480360381019061011d9190611e04565b610afe565b005b61012c6111e3565b6040516101399190611f3a565b60405180910390f35b61015c60048036038101906101579190611f55565b611207565b005b61016661159b565b6040516101739190611fa4565b60405180910390f35b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010180546101c590611fee565b80601f01602080910402602001604051908101604052809291908181526020018280546101f190611fee565b801561023e5780601f106102135761010080835404028352916020019161023e565b820191906000526020600020905b81548152906001019060200180831161022157829003601f168201915b50505050509080600201805461025390611fee565b80601f016020809104026020016040519081016040528092919081815260200182805461027f90611fee565b80156102cc5780601f106102a1576101008083540402835291602001916102cc565b820191906000526020600020905b8154815290600101906020018083116102af57829003601f168201915b5050505050908060030180546102e190611fee565b80601f016020809104026020016040519081016040528092919081815260200182805461030d90611fee565b801561035a5780601f1061032f5761010080835404028352916020019161035a565b820191906000526020600020905b81548152906001019060200180831161033d57829003601f168201915b5050505050908060070160009054906101000a900460ff16908060070160019054906101000a900460ff16905086565b6001600083815260200190815260200160002060070160009054906101000a900460ff166103ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e49061206b565b60405180910390fd5b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb8160000b12158015610424575060058160000b13155b610463576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045a906120d7565b60405180910390fd5b6104a26040518060400160405280601781526020017f4576616c756174696e672070726f706f73616c3a202573000000000000000000815250836115a1565b6104e46040518060400160405280600a81526020017f526174696e673a202573000000000000000000000000000000000000000000008152508260ff166115a1565b60006001600084815260200190815260200160002090508060050160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610589576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058090612143565b60405180910390fd5b60008160060160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460000b60000b1461061d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610614906121af565b60405180910390fd5b818160060160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360000b60ff1602179055506106b86040518060400160405280601c81526020017f4576616c756174696f6e2063617374207375636365737366756c6c790000000081525061163d565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166330a80f07336040518263ffffffff1660e01b815260040161071191906121cf565b600060405180830381600087803b15801561072b57600080fd5b505af115801561073f573d6000803e3d6000fd5b505050507f1b58851fec35e57d778c199afba0f927006ffc41403a5cfb52851fa53c265870833384604051610776939291906121f9565b60405180910390a1505050565b60006060806060600060606001600088815260200190815260200160002060070160009054906101000a900460ff166107f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e89061206b565b60405180910390fd5b60006001600089815260200190815260200160002090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160010182600201836003018460070160019054906101000a900460ff168560040184805461085b90611fee565b80601f016020809104026020016040519081016040528092919081815260200182805461088790611fee565b80156108d45780601f106108a9576101008083540402835291602001916108d4565b820191906000526020600020905b8154815290600101906020018083116108b757829003601f168201915b505050505094508380546108e790611fee565b80601f016020809104026020016040519081016040528092919081815260200182805461091390611fee565b80156109605780601f1061093557610100808354040283529160200191610960565b820191906000526020600020905b81548152906001019060200180831161094357829003601f168201915b5050505050935082805461097390611fee565b80601f016020809104026020016040519081016040528092919081815260200182805461099f90611fee565b80156109ec5780601f106109c1576101008083540402835291602001916109ec565b820191906000526020600020905b8154815290600101906020018083116109cf57829003601f168201915b5050505050925080805480602002602001604051908101604052809291908181526020016000905b82821015610ae25783829060005260206000209060020201604051806040016040529081600082018054610a4790611fee565b80601f0160208091040260200160405190810160405280929190818152602001828054610a7390611fee565b8015610ac05780601f10610a9557610100808354040283529160200191610ac0565b820191906000526020600020905b815481529060010190602001808311610aa357829003601f168201915b5050505050815260200160018201548152505081526020019060010190610a14565b5050505090509650965096509650965096505091939550919395565b600082511480610b1e57506002825110158015610b1d57506003825111155b5b610b5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b54906122a2565b60405180910390fd5b60026000815480929190610b70906122f1565b9190505550610bb46040518060400160405280601481526020017f4372656174696e672070726f706f73616c202573000000000000000000000000815250856116d6565b610bf36040518060400160405280600f81526020017f4465736372697074696f6e3a2025730000000000000000000000000000000000815250846116d6565b610c326040518060400160405280600f81526020017f436f76657220496d6167653a2025730000000000000000000000000000000000815250826116d6565b610c726040518060400160405280601581526020017f4e756d626572206f66206f7074696f6e733a202573000000000000000000000081525083516115a1565b3360016000600254815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550836001600060025481526020019081526020016000206001019081610cee91906124db565b50826001600060025481526020019081526020016000206002019081610d1491906124db565b50806001600060025481526020019081526020016000206003019081610d3a91906124db565b506001806000600254815260200190815260200160002060070160006101000a81548160ff021916908315150217905550600082511115610ebc576001806000600254815260200190815260200160002060070160016101000a81548160ff02191690831515021790555060005b8251811015610eb657610e0a6040518060400160405280601181526020017f416464696e67206f7074696f6e3a202573000000000000000000000000000000815250848381518110610dfd57610dfc6125ad565b5b60200260200101516116d6565b60006040518060400160405280858481518110610e2a57610e296125ad565b5b60200260200101518152602001600081525090506001600060025481526020019081526020016000206004018190806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000019081610e9591906124db565b50602082015181600101555050508080610eae906122f1565b915050610da8565b50611094565b610efa6040518060400160405280601c81526020017f5573696e672064656661756c74205965732f4e6f206f7074696f6e730000000081525061163d565b600060016000600254815260200190815260200160002060070160016101000a81548160ff021916908315150217905550600060405180604001604052806040518060400160405280600381526020017f5965730000000000000000000000000000000000000000000000000000000000815250815260200160008152509050600060405180604001604052806040518060400160405280600281526020017f4e6f000000000000000000000000000000000000000000000000000000000000815250815260200160008152509050600160006002548152602001908152602001600020600401829080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001908161102091906124db565b50602082015181600101555050600160006002548152602001908152602001600020600401819080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001908161108491906124db565b5060208201518160010155505050505b6110ee6040518060400160405280601b81526020017f46696e616c206e756d626572206f66206f7074696f6e733a2025730000000000815250600160006002548152602001908152602001600020600401805490506115a1565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166347180441336040518263ffffffff1660e01b815260040161114791906121cf565b600060405180830381600087803b15801561116157600080fd5b505af1158015611175573d6000803e3d6000fd5b505050507f858151aa03c0b4c7da666b070628ac88b978482fd9c505d93c1a5becaf063d39600254338660016000600254815260200190815260200160002060070160019054906101000a900460ff166040516111d594939291906125dc565b60405180910390a150505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001600083815260200190815260200160002060070160009054906101000a900460ff1661126a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112619061206b565b60405180910390fd5b6001600083815260200190815260200160002060050160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561130b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161130290612674565b60405180910390fd5b60016000838152602001908152602001600020600401805490508110611366576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161135d906126e0565b60405180910390fd5b6113a56040518060400160405280601681526020017f566f74696e67206f6e2070726f706f73616c3a20257300000000000000000000815250836115a1565b6113e46040518060400160405280601081526020017f4f7074696f6e20696e6465783a20257300000000000000000000000000000000815250826115a1565b600060016000848152602001908152602001600020905060018160050160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080600401828154811061146b5761146a6125ad565b5b9060005260206000209060020201600101600081548092919061148d906122f1565b91905055506114d06040518060400160405280601681526020017f566f74652063617374207375636365737366756c6c790000000000000000000081525061163d565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a357bfd5336040518263ffffffff1660e01b815260040161152991906121cf565b600060405180830381600087803b15801561154357600080fd5b505af1158015611557573d6000803e3d6000fd5b505050507f1abe610cf2bf87e57dcc1181fcf5ac0934e843d8344ab9eed6e86c799f62585e83338460405161158e93929190612700565b60405180910390a1505050565b60025481565b61163982826040516024016115b7929190612737565b6040516020818303038152906040527fb60e72cc000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611772565b5050565b6116d3816040516024016116519190612767565b6040516020818303038152906040527f41304fac000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611772565b50565b61176e82826040516024016116ec929190612789565b6040516020818303038152906040527f4b5c4277000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611772565b5050565b6117898161178161178c6117ad565b63ffffffff16565b50565b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b6117b8819050919050565b6117c06127c0565b565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6117e9816117d6565b81146117f457600080fd5b50565b600081359050611806816117e0565b92915050565b600060208284031215611822576118216117cc565b5b6000611830848285016117f7565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061186482611839565b9050919050565b61187481611859565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156118b4578082015181840152602081019050611899565b60008484015250505050565b6000601f19601f8301169050919050565b60006118dc8261187a565b6118e68185611885565b93506118f6818560208601611896565b6118ff816118c0565b840191505092915050565b60008115159050919050565b61191f8161190a565b82525050565b600060c08201905061193a600083018961186b565b818103602083015261194c81886118d1565b9050818103604083015261196081876118d1565b9050818103606083015261197481866118d1565b90506119836080830185611916565b61199060a0830184611916565b979650505050505050565b60008160000b9050919050565b6119b18161199b565b81146119bc57600080fd5b50565b6000813590506119ce816119a8565b92915050565b600080604083850312156119eb576119ea6117cc565b5b60006119f9858286016117f7565b9250506020611a0a858286016119bf565b9150509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600082825260208201905092915050565b6000611a5c8261187a565b611a668185611a40565b9350611a76818560208601611896565b611a7f816118c0565b840191505092915050565b611a93816117d6565b82525050565b60006040830160008301518482036000860152611ab68282611a51565b9150506020830151611acb6020860182611a8a565b508091505092915050565b6000611ae28383611a99565b905092915050565b6000602082019050919050565b6000611b0282611a14565b611b0c8185611a1f565b935083602082028501611b1e85611a30565b8060005b85811015611b5a5784840389528151611b3b8582611ad6565b9450611b4683611aea565b925060208a01995050600181019050611b22565b50829750879550505050505092915050565b600060c082019050611b81600083018961186b565b8181036020830152611b9381886118d1565b90508181036040830152611ba781876118d1565b90508181036060830152611bbb81866118d1565b9050611bca6080830185611916565b81810360a0830152611bdc8184611af7565b9050979650505050505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611c2b826118c0565b810181811067ffffffffffffffff82111715611c4a57611c49611bf3565b5b80604052505050565b6000611c5d6117c2565b9050611c698282611c22565b919050565b600067ffffffffffffffff821115611c8957611c88611bf3565b5b611c92826118c0565b9050602081019050919050565b82818337600083830152505050565b6000611cc1611cbc84611c6e565b611c53565b905082815260208101848484011115611cdd57611cdc611bee565b5b611ce8848285611c9f565b509392505050565b600082601f830112611d0557611d04611be9565b5b8135611d15848260208601611cae565b91505092915050565b600067ffffffffffffffff821115611d3957611d38611bf3565b5b602082029050602081019050919050565b600080fd5b6000611d62611d5d84611d1e565b611c53565b90508083825260208201905060208402830185811115611d8557611d84611d4a565b5b835b81811015611dcc57803567ffffffffffffffff811115611daa57611da9611be9565b5b808601611db78982611cf0565b85526020850194505050602081019050611d87565b5050509392505050565b600082601f830112611deb57611dea611be9565b5b8135611dfb848260208601611d4f565b91505092915050565b60008060008060808587031215611e1e57611e1d6117cc565b5b600085013567ffffffffffffffff811115611e3c57611e3b6117d1565b5b611e4887828801611cf0565b945050602085013567ffffffffffffffff811115611e6957611e686117d1565b5b611e7587828801611cf0565b935050604085013567ffffffffffffffff811115611e9657611e956117d1565b5b611ea287828801611dd6565b925050606085013567ffffffffffffffff811115611ec357611ec26117d1565b5b611ecf87828801611cf0565b91505092959194509250565b6000819050919050565b6000611f00611efb611ef684611839565b611edb565b611839565b9050919050565b6000611f1282611ee5565b9050919050565b6000611f2482611f07565b9050919050565b611f3481611f19565b82525050565b6000602082019050611f4f6000830184611f2b565b92915050565b60008060408385031215611f6c57611f6b6117cc565b5b6000611f7a858286016117f7565b9250506020611f8b858286016117f7565b9150509250929050565b611f9e816117d6565b82525050565b6000602082019050611fb96000830184611f95565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061200657607f821691505b60208210810361201957612018611fbf565b5b50919050565b7f50726f706f73616c20646f6573206e6f74206578697374000000000000000000600082015250565b6000612055601783611885565b91506120608261201f565b602082019050919050565b6000602082019050818103600083015261208481612048565b9050919050565b7f526174696e67206d757374206265206265747765656e202d3520616e64203500600082015250565b60006120c1601f83611885565b91506120cc8261208b565b602082019050919050565b600060208201905081810360008301526120f0816120b4565b9050919050565b7f4d75737420766f7465206265666f7265206576616c756174696e670000000000600082015250565b600061212d601b83611885565b9150612138826120f7565b602082019050919050565b6000602082019050818103600083015261215c81612120565b9050919050565b7f416c7265616479206576616c7561746564000000000000000000000000000000600082015250565b6000612199601183611885565b91506121a482612163565b602082019050919050565b600060208201905081810360008301526121c88161218c565b9050919050565b60006020820190506121e4600083018461186b565b92915050565b6121f38161199b565b82525050565b600060608201905061220e6000830186611f95565b61221b602083018561186b565b61222860408301846121ea565b949350505050565b7f437573746f6d20766f74696e67206d757374206861766520322d33206f70746960008201527f6f6e730000000000000000000000000000000000000000000000000000000000602082015250565b600061228c602383611885565b915061229782612230565b604082019050919050565b600060208201905081810360008301526122bb8161227f565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006122fc826117d6565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361232e5761232d6122c2565b5b600182019050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261239b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261235e565b6123a5868361235e565b95508019841693508086168417925050509392505050565b60006123d86123d36123ce846117d6565b611edb565b6117d6565b9050919050565b6000819050919050565b6123f2836123bd565b6124066123fe826123df565b84845461236b565b825550505050565b600090565b61241b61240e565b6124268184846123e9565b505050565b5b8181101561244a5761243f600082612413565b60018101905061242c565b5050565b601f82111561248f5761246081612339565b6124698461234e565b81016020851015612478578190505b61248c6124848561234e565b83018261242b565b50505b505050565b600082821c905092915050565b60006124b260001984600802612494565b1980831691505092915050565b60006124cb83836124a1565b9150826002028217905092915050565b6124e48261187a565b67ffffffffffffffff8111156124fd576124fc611bf3565b5b6125078254611fee565b61251282828561244e565b600060209050601f8311600181146125455760008415612533578287015190505b61253d85826124bf565b8655506125a5565b601f19841661255386612339565b60005b8281101561257b57848901518255600182019150602085019450602081019050612556565b868310156125985784890151612594601f8916826124a1565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60006080820190506125f16000830187611f95565b6125fe602083018661186b565b818103604083015261261081856118d1565b905061261f6060830184611916565b95945050505050565b7f416c726561647920766f74656400000000000000000000000000000000000000600082015250565b600061265e600d83611885565b915061266982612628565b602082019050919050565b6000602082019050818103600083015261268d81612651565b9050919050565b7f496e76616c6964206f7074696f6e000000000000000000000000000000000000600082015250565b60006126ca600e83611885565b91506126d582612694565b602082019050919050565b600060208201905081810360008301526126f9816126bd565b9050919050565b60006060820190506127156000830186611f95565b612722602083018561186b565b61272f6040830184611f95565b949350505050565b6000604082019050818103600083015261275181856118d1565b90506127606020830184611f95565b9392505050565b6000602082019050818103600083015261278181846118d1565b905092915050565b600060408201905081810360008301526127a381856118d1565b905081810360208301526127b781846118d1565b90509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfea26469706673582212202e6a529c967230879f611024ad2e94ff6cb20aa1fcef0535d8f98eecf9cbae2c64736f6c63430008140033";

type VotingSystemConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VotingSystemConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VotingSystem__factory extends ContractFactory {
  constructor(...args: VotingSystemConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _tokenAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_tokenAddress, overrides || {});
  }
  override deploy(
    _tokenAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_tokenAddress, overrides || {}) as Promise<
      VotingSystem & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): VotingSystem__factory {
    return super.connect(runner) as VotingSystem__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VotingSystemInterface {
    return new Interface(_abi) as VotingSystemInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): VotingSystem {
    return new Contract(address, _abi, runner) as unknown as VotingSystem;
  }
}
