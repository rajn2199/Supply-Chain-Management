// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISupplyChain {
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

    function createProduct(string memory _name, string memory _description, uint256 _price, uint256 _quantity, string memory _imageHash) external returns (uint256);
    function transferOwnership(uint256 _productId, address _newOwner, string memory _location, string memory _notes) external;
    function updateStatus(uint256 _productId, ProductStatus _status, string memory _notes) external;
    function getProductHistory(uint256 _productId) external view returns (ShipmentHistory[] memory);
    function verifyProduct(uint256 _productId) external view returns (bool);
    function batchCreateProducts(string[] memory _names, string[] memory _descriptions, uint256[] memory _prices, uint256[] memory _quantities, string[] memory _imageHashes) external;
    function recallProduct(uint256 _productId, string memory _reason) external;
}
