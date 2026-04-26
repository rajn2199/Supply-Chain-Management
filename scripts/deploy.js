import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();
  console.log("Deploying SupplyChain...");
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();
  const address = await supplyChain.getAddress();
  console.log("SupplyChain deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
