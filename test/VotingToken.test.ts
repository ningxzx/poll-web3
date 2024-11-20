import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { VotingToken } from "../typechain-types";
import { VotingSystem } from "../typechain-types";
import { VotingToken__factory, VotingSystem__factory } from "../typechain-types";

describe("VotingToken", function () {
  let votingToken: VotingToken;
  let votingSystem: VotingSystem;
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

    // Set VotingSystem address in VotingToken
    await votingToken.setVotingSystem(votingSystemAddress);

    // Log initial ownership state
    console.log("Initial owner:", await votingToken.owner());
    console.log("Owner address:", await owner.getAddress());
    console.log("VotingSystem address:", votingSystemAddress);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const ownerAddress = await owner.getAddress();
      expect(await votingToken.owner()).to.equal(ownerAddress);
    });

    it("Should have correct name and symbol", async function () {
      expect(await votingToken.name()).to.equal("Voting Token");
      expect(await votingToken.symbol()).to.equal("VOTE");
    });

    it("Should set the correct voting system address", async function () {
      const votingSystemAddress = await votingSystem.getAddress();
      expect(await votingToken.votingSystem()).to.equal(votingSystemAddress);
    });
  });

  describe("Token Distribution", function () {
    beforeEach(async function () {
      // For token distribution tests, we need to transfer ownership to VotingSystem
      const votingSystemAddress = await votingSystem.getAddress();
      await votingToken.transferOwnership(votingSystemAddress);
    });

    it("Should mint tokens for proposal creation", async function () {
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingSystem.connect(addr1).createProposal("Test", "Description", []);
      const finalBalance = await votingToken.balanceOf(addr1Address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("100"));
    });

    it("Should mint tokens for voting", async function () {
      await votingSystem.createProposal("Test", "Description", []);
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingSystem.connect(addr1).vote(1n, 0n);
      const finalBalance = await votingToken.balanceOf(addr1Address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("10"));
    });

    it("Should mint tokens for evaluation", async function () {
      await votingSystem.createProposal("Test", "Description", []);
      await votingSystem.connect(addr1).vote(1n, 0n);
      const addr1Address = await addr1.getAddress();
      const initialBalance = await votingToken.balanceOf(addr1Address);
      await votingSystem.connect(addr1).evaluateProposal(1n, 5n);
      const finalBalance = await votingToken.balanceOf(addr1Address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("20"));
    });
  });

  describe("Check-in System", function () {
    beforeEach(async function () {
      // For check-in tests, we need to transfer ownership to VotingSystem
      const votingSystemAddress = await votingSystem.getAddress();
      await votingToken.transferOwnership(votingSystemAddress);
    });

    it("Should allow daily check-in", async function () {
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

    it("Should allow check-in after 24 hours", async function () {
      await votingToken.connect(addr1).checkIn();
      
      // Increase time by 24 hours + 1 second
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine", []);
      
      // Should be able to check in again
      let error: unknown;
      try {
        await votingToken.connect(addr1).checkIn();
      } catch (e) {
        error = e;
      }
      expect(error).to.not.exist;
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      // Log current state
      console.log("Before access control test - Current owner:", await votingToken.owner());
      console.log("Before access control test - Owner address:", await owner.getAddress());
      
      // For testing access control, we need the token contract to be owned by the owner
      const ownerAddress = await owner.getAddress();
      await votingToken.transferOwnership(ownerAddress);
      
      // Log state after ownership transfer
      console.log("After ownership transfer - New owner:", await votingToken.owner());
    });

    it("Should only allow owner to mint tokens", async function () {
      let error: unknown;
      try {
        const addr1Contract = votingToken.connect(addr1);
        const addr1Address = await addr1.getAddress();
        await addr1Contract.mint(addr1Address, ethers.parseEther("100"));
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should only allow owner to set VotingSystem address", async function () {
      let error: unknown;
      try {
        const addr1Contract = votingToken.connect(addr1);
        const addr1Address = await addr1.getAddress();
        await addr1Contract.setVotingSystem(addr1Address);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should allow owner to transfer ownership", async function () {
      const addr1Address = await addr1.getAddress();
      await votingToken.transferOwnership(addr1Address);
      expect(await votingToken.owner()).to.equal(addr1Address);
    });
  });

  describe("Token Transfers", function () {
    beforeEach(async function () {
      // Log current state
      console.log("Before token transfer test - Current owner:", await votingToken.owner());
      console.log("Before token transfer test - Owner address:", await owner.getAddress());
      
      // For testing transfers, we need some initial tokens
      const ownerAddress = await owner.getAddress();
      await votingToken.transferOwnership(ownerAddress);
      
      // Log state after ownership transfer
      console.log("After ownership transfer - New owner:", await votingToken.owner());
      
      await votingToken.mint(ownerAddress, ethers.parseEther("1000"));
      
      // Transfer ownership back to VotingSystem
      const votingSystemAddress = await votingSystem.getAddress();
      await votingToken.transferOwnership(votingSystemAddress);
      
      // Log final state
      console.log("After final ownership transfer - Final owner:", await votingToken.owner());
    });

    it("Should allow token transfers between accounts", async function () {
      const amount = ethers.parseEther("100");
      const ownerAddress = await owner.getAddress();
      const addr1Address = await addr1.getAddress();
      const ownerContract = votingToken.connect(owner);
      await ownerContract.transfer(addr1Address, amount);
      expect(await votingToken.balanceOf(addr1Address)).to.equal(amount);
    });

    it("Should fail when transferring more than balance", async function () {
      let error: unknown;
      try {
        const addr1Contract = votingToken.connect(addr1);
        const addr2Address = await addr2.getAddress();
        await addr1Contract.transfer(addr2Address, ethers.parseEther("1000"));
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
    });

    it("Should update balances correctly after transfer", async function () {
      const amount = ethers.parseEther("100");
      const ownerAddress = await owner.getAddress();
      const addr1Address = await addr1.getAddress();
      const initialOwnerBalance = await votingToken.balanceOf(ownerAddress);
      const initialAddr1Balance = await votingToken.balanceOf(addr1Address);

      const ownerContract = votingToken.connect(owner);
      await ownerContract.transfer(addr1Address, amount);

      const finalOwnerBalance = await votingToken.balanceOf(ownerAddress);
      const finalAddr1Balance = await votingToken.balanceOf(addr1Address);

      expect(finalOwnerBalance).to.equal(initialOwnerBalance - amount);
      expect(finalAddr1Balance).to.equal(initialAddr1Balance + amount);
    });
  });
});
