import fs from "fs";
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);

  const artifactPath = "artifacts/contracts/SupplyChain.sol/SupplyChain.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  // Read address from contracts.ts
  const contractsPath = "frontend/lib/contracts.ts";
  const content = fs.readFileSync(contractsPath, "utf8");
  const match = content.match(/export const SUPPLY_CHAIN_ADDRESS = "(0x[a-fA-F0-9]{40})";/);
  if (!match) throw new Error("Could not find address in contracts.ts");
  const address = match[1];

  const contract = new ethers.Contract(address, artifact.abi, signer);

  console.log("Seeding products...");
  
  // Create product 1
  let tx = await contract.createProduct("Laptop Pro X", "High performance laptop", ethers.parseUnits("1200", 0), 10, "ipfs://QmLaptop123");
  await tx.wait();
  console.log("Created Product #1");

  // Create product 2
  tx = await contract.createProduct("Smartphone Gen Z", "Latest 5G smartphone", ethers.parseUnits("800", 0), 50, "ipfs://QmPhone456");
  await tx.wait();
  console.log("Created Product #2");

  // Transfer ownership of product 2
  tx = await contract.transferOwnership(2, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "Warehouse A", "Initial storage");
  await tx.wait();
  console.log("Transferred Product #2 to Account 1");

  console.log("Seeding complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
