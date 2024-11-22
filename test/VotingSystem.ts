import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingSystem, VotingToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("VotingSystem", function () {
  let votingSystem: VotingSystem;
  let votingToken: VotingToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // 部署 VotingToken
    const VotingToken = await ethers.getContractFactory("VotingToken");
    votingToken = await VotingToken.deploy() as VotingToken;
    await votingToken.waitForDeployment();

    // 部署 VotingSystem
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy(await votingToken.getAddress()) as VotingSystem;
    await votingSystem.waitForDeployment();

    // 设置 VotingSystem 地址
    await votingToken.setVotingSystem(await votingSystem.getAddress());
  });

  describe("Create Proposal", function () {
    it("should create a proposal with default Yes/No options", async function () {
      // 使用与前端相同的参数
      const title = "123";
      const description = "";
      const options: string[] = [];

      // 创建提案
      const tx = await votingSystem.createProposal(title, description, options);
      await tx.wait();

      // 获取提案详情
      const proposalId = 1;  // 第一个提案
      const proposal = await votingSystem.getProposalDetails(proposalId);

      // 验证提案详情
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.isCustomVoting).to.equal(false);
      expect(proposal.options.length).to.equal(2);
      expect(proposal.options[0].text).to.equal("Yes");
      expect(proposal.options[1].text).to.equal("No");
      expect(proposal.options[0].votes).to.equal(0n);
      expect(proposal.options[1].votes).to.equal(0n);
    });

    it("should create a proposal with custom options", async function () {
      const title = "Custom Proposal";
      const description = "Test Description";
      const options = ["Option 1", "Option 2", "Option 3"];

      const tx = await votingSystem.createProposal(title, description, options);
      await tx.wait();

      const proposalId = 1;
      const proposal = await votingSystem.getProposalDetails(proposalId);

      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.isCustomVoting).to.equal(true);
      expect(proposal.options.length).to.equal(options.length);
      for (let i = 0; i < options.length; i++) {
        expect(proposal.options[i].text).to.equal(options[i]);
        expect(proposal.options[i].votes).to.equal(0n);
      }
    });

    it("should fail when creating proposal with invalid number of options", async function () {
      const title = "Invalid Proposal";
      const description = "Test Description";
      const options = ["Single Option"];  // 只有一个选项

      await expect(
        votingSystem.createProposal(title, description, options)
      ).to.be.revertedWith("Custom voting must have 2-3 options");
    });
  });
});
