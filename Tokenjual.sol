// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Web3Store {
    struct Product {
        uint id;
        string name;
        string category;
        uint price;
        uint stock;
        string imageHash;
    }
    
    address public owner;
    uint public productCount = 0;
    mapping(uint => Product) public products;
    mapping(address => mapping(uint => uint)) public orders;

    event ProductAdded(
        uint id,
        string name,
        string category,
        uint price,
        uint stock,
        string imageHash
    );
    
    event OrderPlaced(
        address indexed buyer,
        uint productId,
        uint quantity
    );

    constructor() {
        owner = msg.sender;
    }

    function addProduct(
        string memory _name,
        string memory _category,
        uint _price,
        uint _stock,
        string memory _imageHash
    ) public {
        require(msg.sender == owner, "Only owner can add products");
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _category,
            _price,
            _stock,
            _imageHash
        );
        emit ProductAdded(productCount, _name, _category, _price, _stock, _imageHash);
    }

    function buyProduct(uint _id, uint _quantity) public payable {
        Product memory _product = products[_id];
        require(_product.stock >= _quantity, "Not enough stock");
        require(msg.value >= _product.price * _quantity, "Insufficient funds");
        
        products[_id].stock -= _quantity;
        orders[msg.sender][_id] += _quantity;
        emit OrderPlaced(msg.sender, _id, _quantity);
    }
}