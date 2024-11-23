// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingToken.sol";
import "hardhat/console.sol";

contract VotingSystem {
    struct Option {
        string text;
        uint256 votes;
    }

    struct Proposal {
        address creator;
        string title;
        string description;
        string coverImage;  
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
        string[] memory _options,
        string memory _coverImage  
    ) public {
        require(_options.length == 0 || (_options.length >= 2 && _options.length <= 3), 
                "Custom voting must have 2-3 options");

        proposalCount++;
        
        console.log("Creating proposal %s", _title);
        console.log("Description: %s", _description);
        console.log("Cover Image: %s", _coverImage);
        console.log("Number of options: %s", _options.length);

        // 分步骤初始化 Proposal
        proposals[proposalCount].creator = msg.sender;
        proposals[proposalCount].title = _title;
        proposals[proposalCount].description = _description;
        proposals[proposalCount].coverImage = _coverImage;  
        proposals[proposalCount].exists = true;
        
        if (_options.length > 0) {
            proposals[proposalCount].isCustomVoting = true;
            for (uint i = 0; i < _options.length; i++) {
                console.log("Adding option: %s", _options[i]);
                Option memory newOption = Option({
                    text: _options[i],
                    votes: 0
                });
                proposals[proposalCount].options.push(newOption);
            }
        } else {
            // 默认是/否选项
            console.log("Using default Yes/No options");
            proposals[proposalCount].isCustomVoting = false;
            Option memory yesOption = Option({
                text: "Yes",
                votes: 0
            });
            Option memory noOption = Option({
                text: "No",
                votes: 0
            });
            proposals[proposalCount].options.push(yesOption);
            proposals[proposalCount].options.push(noOption);
        }

        console.log("Final number of options: %s", proposals[proposalCount].options.length);
        votingToken.mintProposalReward(msg.sender);

        emit ProposalCreated(proposalCount, msg.sender, _title, proposals[proposalCount].isCustomVoting);
    }

    function vote(uint256 _proposalId, uint256 _optionIndex) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        require(_optionIndex < proposals[_proposalId].options.length, "Invalid option");

        console.log("Voting on proposal: %s", _proposalId);
        console.log("Option index: %s", _optionIndex);

        Proposal storage proposal = proposals[_proposalId];
        proposal.hasVoted[msg.sender] = true;
        proposal.options[_optionIndex].votes++;

        console.log("Vote cast successfully");
        votingToken.mintVoteReward(msg.sender);

        emit Voted(_proposalId, msg.sender, _optionIndex);
    }

    function evaluateProposal(uint256 _proposalId, int8 _rating) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(_rating >= -5 && _rating <= 5, "Rating must be between -5 and 5");

        console.log("Evaluating proposal: %s", _proposalId);
        console.log("Rating: %s", uint8(_rating));

        Proposal storage proposal = proposals[_proposalId];
        require(proposal.hasVoted[msg.sender], "Must vote before evaluating");
        require(proposal.evaluations[msg.sender] == 0, "Already evaluated");

        proposal.evaluations[msg.sender] = _rating;

        console.log("Evaluation cast successfully");
        votingToken.mintEvaluationReward(msg.sender);

        emit Evaluated(_proposalId, msg.sender, _rating);
    }

    function getProposalDetails(uint256 _proposalId) public view returns (
        address creator,
        string memory title,
        string memory description,
        string memory coverImage,  
        bool isCustomVoting,
        Option[] memory options
    ) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.coverImage,  
            proposal.isCustomVoting,
            proposal.options
        );
    }
}
