import fs from "fs";
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0); // get the first account

  const artifactPath = "artifacts/contracts/SupplyChain.sol/SupplyChain.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

  console.log("Deploying SupplyChain via ethers...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SupplyChain deployed to:", address);

  // Update frontend contracts.ts address
  const contractsPath = "frontend/lib/contracts.ts";
  let content = fs.readFileSync(contractsPath, "utf8");
  content = content.replace(/export const SUPPLY_CHAIN_ADDRESS = ".*";/, `export const SUPPLY_CHAIN_ADDRESS = "${address}";`);
  fs.writeFileSync(contractsPath, content);
  console.log("Updated frontend/lib/contracts.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
