import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];
  const delegateToAddress = args[3];

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
  console.log(`Delegate your vote to address ${delegateToAddress } ...`);
  await deployedContract.delegate(delegateToAddress );
  console.log(`${delegateToAddress} has been delegated by you.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});