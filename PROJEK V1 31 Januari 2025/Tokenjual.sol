// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Web3Store {
    struct Product {
        uint id;
        string name;
        string category;
        uint price;
        uint stock;
        string imageHash;
        address owner;
    }
    
    struct User {
        string email;
        address wallet;
    }
    
    address public admin;
    uint public productCount = 0;
    uint public userCount = 0;
    
    mapping(uint => Product) public products;
    mapping(address => User) public users;
    mapping(address => bool) public isRegistered;
    mapping(address => mapping(uint => uint)) public orders;
    
    event UserRegistered(address indexed user, string email);
    event ProductAdded(uint indexed id, string name, string category, uint price);
    event ProductUpdated(uint indexed id, string name, uint price, string imageHash);
    event ProductDeleted(uint indexed id);
    event OrderPlaced(address indexed buyer, uint indexed productId, uint quantity);
    event TransactionCompleted(
    address indexed buyer,
    uint indexed productId,
    uint quantity,
    uint totalPrice,
    uint timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyProductOwner(uint _productId) {
        require(products[_productId].owner == msg.sender, "Not product owner");
        _;
    }

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "User not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // User Management
    function register(string memory _email) external {
        require(!isRegistered[msg.sender], "User already registered");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        users[msg.sender] = User(_email, msg.sender);
        isRegistered[msg.sender] = true;
        userCount++;
        
        emit UserRegistered(msg.sender, _email);
    }

    function getMyEmail() external view returns (string memory) {
        return users[msg.sender].email;
    }

    // Product Management
    function addProduct(
        string memory _name,
        string memory _category,
        uint _price,
        uint _stock,
        string memory _imageHash
    ) external onlyRegistered {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_stock > 0, "Stock must be greater than 0");
        require(bytes(_imageHash).length > 0, "Image hash required");

        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _category,
            _price,
            _stock,
            _imageHash,
            msg.sender
        );
        
        emit ProductAdded(productCount, _name, _category, _price);
    }

    function updateProduct(
        uint _productId,
        string memory _newName,
        uint _newPrice,
        string memory _newImageHash
    ) external onlyProductOwner(_productId) {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(bytes(_newName).length > 0, "Name cannot be empty");
        require(_newPrice > 0, "Price must be greater than 0");
        
        Product storage product = products[_productId];
        product.name = _newName;
        product.price = _newPrice;
        product.imageHash = _newImageHash;
        
        emit ProductUpdated(_productId, _newName, _newPrice, _newImageHash);
    }

    function deleteProduct(uint _productId) external onlyProductOwner(_productId) {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        
        delete products[_productId];
        emit ProductDeleted(_productId);
    }

    // Marketplace Functions
    function buyProduct(uint _productId, uint _quantity) external payable onlyRegistered {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        require(product.stock >= _quantity, "Insufficient stock");
        
        uint totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        
        // Transfer funds to product owner
        (bool success, ) = payable(product.owner).call{value: totalPrice}("");
        require(success, "Payment failed");
        
        // Update product stock
        product.stock -= _quantity;
        
        // Record order
        orders[msg.sender][_productId] += _quantity;
        
        // Refund excess
        if(msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit OrderPlaced(msg.sender, _productId, _quantity);
        emit TransactionCompleted(
        msg.sender,
        _productId,
        _quantity,
        totalPrice,
        block.timestamp
    );


    }

    // Admin Functions
    function forceDeleteProduct(uint _productId) external onlyAdmin {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        delete products[_productId];
        emit ProductDeleted(_productId);
    }

    function withdrawFees() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
