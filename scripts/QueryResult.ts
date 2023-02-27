// 
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];


  
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );


  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("PRIVATE_KEY is not set");
  const wallet = new ethers.Wallet(privateKey);

  
  const signer = wallet.connect(provider);
  console.log("The signer is: " + signer.address);


  const contract = new Ballot__factory(signer);
  console.log(`Attaching to ballot contract at address ${contractAddress} ...`);
  const deployedContract = contract.attach(contractAddress);
  console.log("Successfully attached!");




 
  const Winner = await deployedContract.winningProposal();
  console.log("The winning proposal is:" + Winner);
 
  const WinnerName = await deployedContract.winnerName();
  console.log("Winner name:" + WinnerName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
