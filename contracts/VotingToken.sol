// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingToken is ERC20, Ownable {
    uint256 public constant PROPOSAL_REWARD = 100 * 10 ** 18;
    uint256 public constant VOTE_REWARD = 10 * 10 ** 18;
    uint256 public constant EVALUATION_REWARD = 20 * 10 ** 18;
    uint256 public constant DAILY_CHECKIN_REWARD = 5 * 10 ** 18;
    uint256 public constant INITIAL_TOKEN_AMOUNT = 100 * 10 ** 18;

    mapping(address => uint256) public lastCheckIn;
    mapping(address => bool) public hasInitialTokens;
    address public votingSystem;

    constructor() ERC20("Vote Coin", "VOTC") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    modifier onlyVotingSystem() {
        require(msg.sender == votingSystem, "Only VotingSystem can call this");
        _;
    }

    function setVotingSystem(address _votingSystem) external onlyOwner {
        require(_votingSystem != address(0), "Invalid voting system address");
        votingSystem = _votingSystem;
    }

    function checkIn() external {
        // 如果是新用户，先给初始代币
        if (!hasInitialTokens[msg.sender]) {
            _mint(msg.sender, INITIAL_TOKEN_AMOUNT);
            hasInitialTokens[msg.sender] = true;
        }

        require(
            block.timestamp >= lastCheckIn[msg.sender] + 1 days ||
                lastCheckIn[msg.sender] == 0,
            "Already checked in today"
        );

        lastCheckIn[msg.sender] = block.timestamp;
        _mint(msg.sender, DAILY_CHECKIN_REWARD);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function mintProposalReward(address recipient) external onlyVotingSystem {
        _mint(recipient, PROPOSAL_REWARD);
    }

    function mintVoteReward(address voter) external onlyVotingSystem {
        _mint(voter, VOTE_REWARD);
    }

    function mintEvaluationReward(address evaluator) external onlyVotingSystem {
        _mint(evaluator, EVALUATION_REWARD);
    }

    function getInitialTokens() external {
        require(!hasInitialTokens[msg.sender], "Already received initial tokens");
        hasInitialTokens[msg.sender] = true;
        _mint(msg.sender, INITIAL_TOKEN_AMOUNT);
    }
}
