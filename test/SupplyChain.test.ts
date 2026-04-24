import { expect } from "chai";
import { ethers } from "hardhat";

describe("SupplyChain", function () {
  async function deploySupplyChainFixture() {
    const [admin, manufacturer, distributor, retailer, user] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    return { supplyChain, admin, manufacturer, distributor, retailer, user };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { supplyChain, admin } = await deploySupplyChainFixture();
      const adminRole = await supplyChain.DEFAULT_ADMIN_ROLE();
      expect(await supplyChain.hasRole(adminRole, admin.address)).to.equal(true);
    });

    it("Should grant manufacturer role to deployer", async function () {
      const { supplyChain, admin } = await deploySupplyChainFixture();
      const manufacturerRole = await supplyChain.MANUFACTURER_ROLE();
      expect(await supplyChain.hasRole(manufacturerRole, admin.address)).to.equal(true);
    });
  });

  describe("Product Creation", function () {
    it("Should allow manufacturer to create a product", async function () {
      const { supplyChain, admin } = await deploySupplyChainFixture();

      await expect(supplyChain.createProduct("Apple", "Fresh Apples", 100, 50))
        .to.emit(supplyChain, "ProductCreated")
        .withArgs(1, "Apple", admin.address);

      const product = await supplyChain.products(1);
      expect(product.name).to.equal("Apple");
      expect(product.status).to.equal(0); // ProductStatus.Created
    });
  });

  describe("Product Transfer", function () {
    it("Should transfer ownership and emit events", async function () {
      const { supplyChain, admin, distributor } = await deploySupplyChainFixture();

      await supplyChain.createProduct("Laptop", "Gaming Laptop", 1500, 10);
      
      await expect(supplyChain.transferOwnership(1, distributor.address, "Warehouse A", "Sent to distributor"))
        .to.emit(supplyChain, "OwnershipTransferred")
        .withArgs(1, admin.address, distributor.address)
        .and.to.emit(supplyChain, "ProductShipped")
        .withArgs(1, admin.address, distributor.address, "Warehouse A");

      expect(await supplyChain.productOwners(1)).to.equal(distributor.address);
    });
  });

  describe("Status Update", function () {
    it("Should update product status", async function () {
      const { supplyChain, admin } = await deploySupplyChainFixture();

      await supplyChain.createProduct("Phone", "Smartphone", 800, 20);
      await supplyChain.updateStatus(1, 1, "In Transit now"); // ProductStatus.InTransit

      const product = await supplyChain.products(1);
      expect(product.status).to.equal(1);
    });
  });
});
