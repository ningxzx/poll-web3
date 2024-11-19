// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingToken is ERC20, Ownable {
    uint256 public constant PROPOSAL_REWARD = 100 * 10**18;
    uint256 public constant VOTE_REWARD = 10 * 10**18;
    uint256 public constant EVALUATION_REWARD = 20 * 10**18;

    constructor() ERC20("VoteRewardToken", "VRT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18);  // 初始代币供应
    }

    function mintProposalReward(address recipient) external onlyOwner {
        _mint(recipient, PROPOSAL_REWARD);
    }

    function mintVoteReward(address voter) external onlyOwner {
        _mint(voter, VOTE_REWARD);
    }

    function mintEvaluationReward(address evaluator) external onlyOwner {
        _mint(evaluator, EVALUATION_REWARD);
    }
}
