// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingToken.sol";

contract VotingSystem {
    struct Option {
        string text;
        uint256 votes;
    }

    struct Proposal {
        address creator;
        string title;
        string description;
        Option[] options;
        mapping(address => bool) hasVoted;
        mapping(address => int8) evaluations;
        bool exists;
        bool isCustomVoting;
    }

    VotingToken public votingToken;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event ProposalCreated(uint256 proposalId, address creator, string title, bool isCustomVoting);
    event Voted(uint256 proposalId, address voter, uint256 optionIndex);
    event Evaluated(uint256 proposalId, address evaluator, int8 rating);

    constructor(address _tokenAddress) {
        votingToken = VotingToken(_tokenAddress);
    }

    function createProposal(
        string memory _title, 
        string memory _description,
        string[] memory _options
    ) public {
        require(_options.length == 0 || (_options.length >= 2 && _options.length <= 3), 
                "Custom voting must have 2-3 options");

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        
        newProposal.creator = msg.sender;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.exists = true;
        
        if (_options.length > 0) {
            newProposal.isCustomVoting = true;
            for (uint i = 0; i < _options.length; i++) {
                newProposal.options.push(Option({
                    text: _options[i],
                    votes: 0
                }));
            }
        } else {
            // 默认是/否选项
            newProposal.isCustomVoting = false;
            newProposal.options.push(Option({
                text: "Yes",
                votes: 0
            }));
            newProposal.options.push(Option({
                text: "No",
                votes: 0
            }));
        }

        votingToken.mintProposalReward(msg.sender);

        emit ProposalCreated(proposalCount, msg.sender, _title, newProposal.isCustomVoting);
    }

    function vote(uint256 _proposalId, uint256 _optionIndex) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        require(_optionIndex < proposals[_proposalId].options.length, "Invalid option");

        Proposal storage proposal = proposals[_proposalId];
        proposal.hasVoted[msg.sender] = true;
        proposal.options[_optionIndex].votes++;

        votingToken.mintVoteReward(msg.sender);

        emit Voted(_proposalId, msg.sender, _optionIndex);
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
        bool isCustomVoting,
        Option[] memory options
    ) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.isCustomVoting,
            proposal.options
        );
    }
}
