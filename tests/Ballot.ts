import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3", "Proposal 4"];
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let i = 0; i < array.length; i++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[i]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployTransaction.wait();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });
    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });
    it("sets the deployer address as chairperson", async function () {
      const signers = await ethers.getSigners();
      const deployerAddress = signers[0].address;
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(deployerAddress);
    });

    it("sets the voting weight for the chainperson as 1", async function () {
        const chairperson = await ballotContract.chairperson();
        const chairpersonVoter = await ballotContract.voters(chairperson);
        expect(chairpersonVoter.weight).to.eq(1);

    });
        
  });
});
