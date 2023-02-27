// Main function
// import your pkey / seed
// -> you need to be the chairperson!
// assemble a signer
// receive the address of the ballot argument
// attach the factory to the address
// receive address of the voter as argument
// pass the address as parameter
// call the function to give right to vote
// pass the addrss of the voter as parameter


import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  const giveRightToVoteToAddress = args[3];

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
  console.log("Successfully attached!");
  console.log(`Giving right to vote to address ${giveRightToVoteToAddress} ...`);
  await deployedContract.giveRightToVote(giveRightToVoteToAddress);
  console.log(`${giveRightToVoteToAddress} now has voting rights.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});