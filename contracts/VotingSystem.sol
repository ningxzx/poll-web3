// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingToken.sol";

contract VotingSystem {
    struct Proposal {
        address creator;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        mapping(address => int8) evaluations;
        bool exists;
    }

    VotingToken public votingToken;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event ProposalCreated(uint256 proposalId, address creator, string title);
    event Voted(uint256 proposalId, address voter, bool support);
    event Evaluated(uint256 proposalId, address evaluator, int8 rating);

    constructor(address _tokenAddress) {
        votingToken = VotingToken(_tokenAddress);
    }

    function createProposal(string memory _title, string memory _description) public {
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        
        newProposal.creator = msg.sender;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.exists = true;

        votingToken.mintProposalReward(msg.sender);

        emit ProposalCreated(proposalCount, msg.sender, _title);
    }

    function vote(uint256 _proposalId, bool _support) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");

        Proposal storage proposal = proposals[_proposalId];
        proposal.hasVoted[msg.sender] = true;

        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        votingToken.mintVoteReward(msg.sender);

        emit Voted(_proposalId, msg.sender, _support);
    }

    function evaluateProposal(uint256 _proposalId, int8 _rating) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(_rating >= -5 && _rating <= 5, "Rating must be between -5 and 5");

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.hasVoted[msg.sender], "Must vote before evaluating");
        require(proposal.evaluations[msg.sender] == 0, "Already evaluated");

        proposal.evaluations[msg.sender] = _rating;

        votingToken.mintEvaluationReward(msg.sender);

        emit Evaluated(_proposalId, msg.sender, _rating);
    }

    function getProposalDetails(uint256 _proposalId) public view returns (
        address creator, 
        string memory title, 
        string memory description, 
        uint256 votesFor, 
        uint256 votesAgainst
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst
        );
    }
}
