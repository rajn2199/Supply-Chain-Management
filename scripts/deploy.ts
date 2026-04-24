import hre from "hardhat";

async function main() {
  console.log(Object.keys(hre));
  const ethers = hre.ethers;

  console.log("Deploying SupplyChain...");

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  const address = await supplyChain.getAddress();
  console.log("SupplyChain deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});