// Main function
// import your pkey / seed
// -> you don't need to be the chairperson!
// assemble a signer
// receive the address of the ballot as argument
// receive the index of the proposal to vote on
// attached the factory to the address
// call the function to vote

// Execute this script to cast a vote
// On mac: 
// yarn run ts-node ./scripts/CastVote.ts "0x089f7621c06ddb97cd2794aF81a0f722AE56AE65" "1" 
// The args in the end are [contract address] and [proposal number you want to vote for]

import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  console.log("ContractAddress: ", contractAddress);
  const proposal = args[3];
  console.log("Proposal N.: ", proposal);

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("PRIVATE_KEY is not set");
  }
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const contract = new Ballot__factory(signer);
  console.log(`Attaching to ballot contract at address ${contractAddress} ...`);
  const deployedContract = contract.attach(contractAddress);
  console.log("Successfully attached");

  const signerVoter = await deployedContract.voters(signer.address);
  if (signerVoter.voted) {
    throw new Error("You have already voted!");
  }

  const signerVotingWeight = await signerVoter.weight;
  if (signerVotingWeight.isNegative() || signerVotingWeight.isZero()) {
    throw new Error("You do not have voting rights!");
  }
  
  console.log(`Casting vote with address ${signer.address} ...`);
  const tx = await deployedContract.connect(signer).vote(proposal);
  await tx.wait();
  
  console.log(`${signer.address} voted for ${proposal}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});