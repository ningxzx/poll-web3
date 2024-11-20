import { ethers } from "hardhat";
import fs from 'fs';

async function main() {
  // Deploy VotingToken first
  const VotingToken = await ethers.getContractFactory("VotingToken");
  const votingToken = await VotingToken.deploy();
  await votingToken.waitForDeployment();

  const votingTokenAddress = await votingToken.getAddress();
  console.log("VotingToken deployed to:", votingTokenAddress);

  // Deploy VotingSystem with VotingToken address
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy(votingTokenAddress);
  await votingSystem.waitForDeployment();

  const votingSystemAddress = await votingSystem.getAddress();
  console.log("VotingSystem deployed to:", votingSystemAddress);

  // Save deployment addresses to a file
  const deploymentLog = `VotingToken deployed to: ${votingTokenAddress}\nVotingSystem deployed to: ${votingSystemAddress}\n`;
  fs.writeFileSync('deployment-logs.txt', deploymentLog);
  console.log('Deployment addresses saved to deployment-logs.txt');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
