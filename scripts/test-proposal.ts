import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 获取已部署的合约
  const VotingSystem = await ethers.getContractAt(
    "VotingSystem",
    "0x09635F643e140090A9A8Dcd712eD6285858ceBef"
  );

  console.log("Testing createProposal with default options...");
  try {
    const tx = await VotingSystem.createProposal(
      "Test Proposal 1",
      "This is a test proposal with default Yes/No options",
      []
    );
    await tx.wait();
    console.log("Default proposal created successfully!");

    // 获取提案详情
    const proposalCount = await VotingSystem.proposalCount();
    const proposal = await VotingSystem.getProposalDetails(proposalCount);
    console.log("\nProposal details:");
    console.log("Title:", proposal.title);
    console.log("Description:", proposal.description);
    console.log("Creator:", proposal.creator);
    console.log("Is Custom Voting:", proposal.isCustomVoting);
    console.log("Options:", proposal.options);
  } catch (error) {
    console.error("Error creating default proposal:", error);
  }

  console.log("\nTesting createProposal with custom options...");
  try {
    const tx = await VotingSystem.createProposal(
      "Test Proposal 2",
      "This is a test proposal with custom options",
      ["Option A", "Option B", "Option C"]
    );
    await tx.wait();
    console.log("Custom proposal created successfully!");

    // 获取提案详情
    const proposalCount = await VotingSystem.proposalCount();
    const proposal = await VotingSystem.getProposalDetails(proposalCount);
    console.log("\nProposal details:");
    console.log("Title:", proposal.title);
    console.log("Description:", proposal.description);
    console.log("Creator:", proposal.creator);
    console.log("Is Custom Voting:", proposal.isCustomVoting);
    console.log("Options:", proposal.options);
  } catch (error) {
    console.error("Error creating custom proposal:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
