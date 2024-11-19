const hre = require("hardhat");

async function main() {
  // 部署VotingToken合约
  const VotingToken = await hre.ethers.getContractFactory("VotingToken");
  const votingToken = await VotingToken.deploy();
  await votingToken.waitForDeployment();
  console.log("VotingToken deployed to:", await votingToken.getAddress());

  // 部署VotingSystem合约
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy(await votingToken.getAddress());
  await votingSystem.waitForDeployment();
  console.log("VotingSystem deployed to:", await votingSystem.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
