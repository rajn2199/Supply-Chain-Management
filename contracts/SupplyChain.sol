// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SupplyChain is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    enum ProductStatus { Created, InTransit, InWarehouse, Delivered, Rejected }

    struct Product {
        uint256 id;
        string name;
        string description;
        address manufacturer;
        uint256 price;
        uint256 quantity;
        string imageHash;
        ProductStatus status;
        uint256 timestamp;
    }

    struct ShipmentHistory {
        address from;
        address to;
        string location;
        uint256 timestamp;
        string notes;
    }

    uint256 private _productIdCounter;

    mapping(uint256 => Product) public products;
    mapping(uint256 => ShipmentHistory[]) public shipmentHistories;
    mapping(uint256 => address) public productOwners;

    event ProductCreated(uint256 indexed id, string name, address indexed manufacturer);
    event ProductShipped(uint256 indexed id, address indexed from, address indexed to, string location);
    event StatusUpdated(uint256 indexed id, ProductStatus status, string notes);
    event OwnershipTransferred(uint256 indexed id, address indexed previousOwner, address indexed newOwner);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANUFACTURER_ROLE, msg.sender); // Admin is also a manufacturer by default
    }

    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity,
        string memory _imageHash
    ) public onlyRole(MANUFACTURER_ROLE) returns (uint256) {
        _productIdCounter++;
        uint256 newId = _productIdCounter;

        products[newId] = Product({
            id: newId,
            name: _name,
            description: _description,
            manufacturer: msg.sender,
            price: _price,
            quantity: _quantity,
            imageHash: _imageHash,
            status: ProductStatus.Created,
            timestamp: block.timestamp
        });

        productOwners[newId] = msg.sender;

        shipmentHistories[newId].push(ShipmentHistory({
            from: address(0),
            to: msg.sender,
            location: "Factory",
            timestamp: block.timestamp,
            notes: "Product created"
        }));

        emit ProductCreated(newId, _name, msg.sender);
        emit StatusUpdated(newId, ProductStatus.Created, "Product created");

        return newId;
    }

    function batchCreateProducts(
        string[] memory _names,
        string[] memory _descriptions,
        uint256[] memory _prices,
        uint256[] memory _quantities,
        string[] memory _imageHashes
    ) public onlyRole(MANUFACTURER_ROLE) {
        require(
            _names.length == _descriptions.length &&
            _names.length == _prices.length &&
            _names.length == _quantities.length &&
            _names.length == _imageHashes.length,
            "Mismatched input arrays"
        );

        for (uint256 i = 0; i < _names.length; i++) {
            createProduct(_names[i], _descriptions[i], _prices[i], _quantities[i], _imageHashes[i]);
        }
    }

    function transferOwnership(
        uint256 _productId,
        address _newOwner,
        string memory _location,
        string memory _notes
    ) public {
        require(products[_productId].id != 0, "Product does not exist");
        require(productOwners[_productId] == msg.sender, "Caller is not the owner");
        
        // Prevent transfer if status is Rejected or Delivered
        require(products[_productId].status != ProductStatus.Rejected, "Product is rejected");
        require(products[_productId].status != ProductStatus.Delivered, "Product already delivered");

        address previousOwner = productOwners[_productId];
        productOwners[_productId] = _newOwner;

        shipmentHistories[_productId].push(ShipmentHistory({
            from: previousOwner,
            to: _newOwner,
            location: _location,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit OwnershipTransferred(_productId, previousOwner, _newOwner);
        emit ProductShipped(_productId, previousOwner, _newOwner, _location);
    }

    function updateStatus(
        uint256 _productId,
        ProductStatus _status,
        string memory _notes
    ) public {
        require(products[_productId].id != 0, "Product does not exist");
        require(
            productOwners[_productId] == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not owner or admin"
        );

        products[_productId].status = _status;
        products[_productId].timestamp = block.timestamp;

        // Log history with same owner but updated status
        shipmentHistories[_productId].push(ShipmentHistory({
            from: msg.sender,
            to: msg.sender,
            location: "Status Update",
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit StatusUpdated(_productId, _status, _notes);
    }

    function recallProduct(uint256 _productId, string memory _reason) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(products[_productId].id != 0, "Product does not exist");
        
        products[_productId].status = ProductStatus.Rejected;
        products[_productId].timestamp = block.timestamp;

        shipmentHistories[_productId].push(ShipmentHistory({
            from: productOwners[_productId],
            to: address(0), // Sent back or invalidated
            location: "Recall Center",
            timestamp: block.timestamp,
            notes: string(abi.encodePacked("Recalled: ", _reason))
        }));

        emit StatusUpdated(_productId, ProductStatus.Rejected, _reason);
    }

    function getProductHistory(uint256 _productId) public view returns (ShipmentHistory[] memory) {
        require(products[_productId].id != 0, "Product does not exist");
        return shipmentHistories[_productId];
    }

    function verifyProduct(uint256 _productId) public view returns (bool) {
        if (products[_productId].id == 0) return false;
        if (products[_productId].status == ProductStatus.Rejected) return false;
        
        return true; // Simple verification logic for now
    }
}
