import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  console.log("Deploying SupplyChain...");

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  const address = await supplyChain.getAddress();
  console.log("SupplyChain deployed to:", address);

  // ── Seed sample products so the frontend has data to display ──
  console.log("\nSeeding sample products...");

  const products = [
    {
      name: "Organic Coffee Beans",
      description: "Premium single-origin Arabica coffee beans from Ethiopia. Fair trade certified.",
      price: 2499,   // $24.99
      quantity: 500,
      imageHash: "",
    },
    {
      name: "Electronic Sensor Module",
      description: "Industrial-grade IoT temperature & humidity sensor. IP67 rated.",
      price: 8999,   // $89.99
      quantity: 200,
      imageHash: "",
    },
    {
      name: "Pharmaceutical Vaccine Batch",
      description: "mRNA vaccine batch #V-2026-04. Requires cold-chain storage at -20°C.",
      price: 150000, // $1,500.00
      quantity: 1000,
      imageHash: "",
    },
  ];

  for (const p of products) {
    const tx = await supplyChain.createProduct(
      p.name,
      p.description,
      p.price,
      p.quantity,
      p.imageHash
    );
    await tx.wait();
    console.log(`  ✓ Created "${p.name}"`);
  }

  console.log(`\nDone! ${products.length} products seeded.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});