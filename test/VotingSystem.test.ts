import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { VotingToken, VotingSystem } from "../typechain-types";
import { VotingToken__factory, VotingSystem__factory } from "../typechain-types";

describe("VotingSystem", function () {
  let votingSystem: VotingSystem;
  let votingToken: VotingToken;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy VotingToken
    const VotingTokenFactory = new VotingToken__factory(owner);
    votingToken = await VotingTokenFactory.deploy();
    await votingToken.waitForDeployment();
    const votingTokenAddress = await votingToken.getAddress();

    // Deploy VotingSystem
    const VotingSystemFactory = new VotingSystem__factory(owner);
    votingSystem = await VotingSystemFactory.deploy(votingTokenAddress);
    await votingSystem.waitForDeployment();
    const votingSystemAddress = await votingSystem.getAddress();

    // Setup initial configuration
    await votingToken.setVotingSystem(votingSystemAddress);
    await votingToken.transferOwnership(votingSystemAddress);
  });

  describe("Proposal Creation", function () {
    it("Should create a proposal with default Yes/No options", async function () {
      const ownerAddress = await owner.getAddress();
      const initialBalance = await votingToken.balanceOf(ownerAddress);
      
      await votingSystem.createProposal(
        "Test Proposal",
        "Test Description",
        []
      );

      const proposalCount = await votingSystem.proposalCount();
      expect(proposalCount).to.equal(1n);

      const finalBalance = await votingToken.balanceOf(ownerAddress);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("100"));
    });

    it("Should create a proposal with custom options", async function () {
      await votingSystem.createProposal(
        "Custom Proposal",
        "Test Description",
        ["Option A", "Option B", "Option C"]
      );

      const proposalCount = await votingSystem.proposalCount();
      expect(proposalCount).to.equal(1n);
    });

    it("Should fail when creating proposal with invalid number of options", async function () {
      let error: unknown;
      try {
        await votingSystem.createProposal(
          "Invalid Proposal",
          "Test Description",
          ["Single Option"]
        );
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await votingSystem.createProposal(
        "Test Proposal",
        "Test Description",
        []
      );
    });

    it("Should allow voting on a proposal", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingSystem.connect(addr1).vote(1n, 0n);
      const finalBalance = await votingToken.balanceOf(addr1Address);
      
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("10"));
    });

    it("Should prevent double voting", async function () {
      await votingSystem.connect(addr1).vote(1n, 0n);
      let error: unknown;
      try {
        await votingSystem.connect(addr1).vote(1n, 0n);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should fail when voting on non-existent proposal", async function () {
      let error: unknown;
      try {
        await votingSystem.connect(addr1).vote(999n, 0n);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });
  });

  describe("Evaluation", function () {
    beforeEach(async function () {
      await votingSystem.createProposal(
        "Test Proposal",
        "Test Description",
        []
      );
      await votingSystem.connect(addr1).vote(1n, 0n);
    });

    it("Should allow evaluating after voting", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingSystem.connect(addr1).evaluateProposal(1n, 5n);
      const finalBalance = await votingToken.balanceOf(addr1Address);
      
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("20"));
    });

    it("Should prevent evaluation without voting first", async function () {
      let error: unknown;
      try {
        await votingSystem.connect(addr2).evaluateProposal(1n, 5n);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should prevent invalid rating values", async function () {
      let error: unknown;
      try {
        await votingSystem.connect(addr1).evaluateProposal(1n, 6n);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should prevent multiple evaluations", async function () {
      await votingSystem.connect(addr1).evaluateProposal(1n, 5n);
      let error: unknown;
      try {
        await votingSystem.connect(addr1).evaluateProposal(1n, 4n);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });
  });

  describe("Token Rewards", function () {
    it("Should give tokens for daily check-in", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingToken.connect(addr1).checkIn();
      const finalBalance = await votingToken.balanceOf(addr1Address);
      
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("5"));
    });

    it("Should prevent multiple check-ins in the same day", async function () {
      await votingToken.connect(addr1).checkIn();
      let error: unknown;
      try {
        await votingToken.connect(addr1).checkIn();
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });
  });
});
