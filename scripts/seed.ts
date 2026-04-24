import { ethers } from "ethers";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const owner = await provider.getSigner(0);
  console.log("Seeding with account:", owner.address);

  const contractsPath = path.join(__dirname, "../frontend/lib/contracts.ts");
  const content = fs.readFileSync(contractsPath, "utf8");
  const match = content.match(/export const SUPPLY_CHAIN_ADDRESS = "(0x[a-fA-F0-9]{40})";/);
  if (!match) throw new Error("Could not find address in contracts.ts");
  const address = match[1];

  const artifactPath = path.join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const SupplyChain = new ethers.Contract(address, artifact.abi, owner);

  console.log("Creating products...");

  const tx1 = await SupplyChain.createProduct(
    "Laptop Model X",
    "High performance laptop",
    ethers.parseEther("0.1"),
    100,
    ""
  );
  await tx1.wait();
  console.log("✅ Product 1 created - Laptop Model X");

  const tx2 = await SupplyChain.createProduct(
    "Smartphone Y",
    "Latest model smartphone",
    ethers.parseEther("0.05"),
    200,
    ""
  );
  await tx2.wait();
  console.log("✅ Product 2 created - Smartphone Y");

  const tx3 = await SupplyChain.createProduct(
    "Electronics Kit A",
    "Arduino starter kit",
    ethers.parseEther("0.01"),
    500,
    ""
  );
  await tx3.wait();
  console.log("✅ Product 3 created - Electronics Kit A");

  console.log("\n🎉 All 3 products created successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});