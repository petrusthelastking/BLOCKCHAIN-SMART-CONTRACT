let provider;
let signer;
let contract;
const contractAddress = "0x67993ff6cd2d17975781f9e105306b8731de7a78"; // Ganti dengan alamat kontrak Anda
const abi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_category",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_stock",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_imageHash",
                    "type": "string"
                }
            ],
            "name": "addProduct",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_quantity",
                    "type": "uint256"
                }
            ],
            "name": "buyProduct",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "productId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "quantity",
                    "type": "uint256"
                }
            ],
            "name": "OrderPlaced",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "category",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "stock",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "imageHash",
                    "type": "string"
                }
            ],
            "name": "ProductAdded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "orders",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "productCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "products",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "category",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "stock",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "imageHash",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
];

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum); // Remove "const"
        try {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner(); // Remove "const"
            contract = new ethers.Contract(contractAddress, abi, signer); // Initialize contract
            console.log("Connected:", await signer.getAddress());
            loadProducts(); // Load products after connection
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    } else {
        alert("MetaMask not detected");
    }
}


async function loadProducts() {
    const productCount = await contract.productCount();
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";

    for (let i = 1; i <= productCount; i++) {
        const product = await contract.products(i);
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="https://ipfs.io/ipfs/${product[5]}" alt="${product[1]}">
            <h3>${product[1]}</h3>
            <p>Category: ${product[2]}</p>
            <p>Price: ${ethers.utils.formatEther(product[3])} ETH</p>
            <p>Stock: ${product[4]}</p>
            <button onclick="buyProduct(${i})">Buy</button>
        `;
        productsDiv.appendChild(productDiv);
    }
}

async function buyProduct(id) {
    const quantityInput = prompt("Enter quantity:");
    if (!quantityInput) return; // Batal jika pengguna tidak memasukkan nilai

    // Pastikan quantity adalah bilangan bulat (integer)
    if (!/^\d+$/.test(quantityInput)) {
        alert("Quantity must be a whole number (e.g., 1, 2, 3).");
        return;
    }

    try {
        const quantity = ethers.BigNumber.from(quantityInput); // Konversi ke BigNumber
        const product = await contract.products(id);
        const pricePerItem = product.price; // Harga per item dalam wei (sudah sebagai BigNumber)
        const totalPrice = pricePerItem.mul(quantity); // Total harga dalam wei

        // Kirim transaksi dengan nilai (value) dalam wei
        const transaction = await contract.buyProduct(id, quantity, {
            value: totalPrice
        });

        await transaction.wait();
        alert("Purchase successful!");
        loadProducts();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert(`Purchase failed: ${error.message}`);
    }
}

// ✅ Correct order: Function first, event listener later

// Define addProduct
async function addProduct() {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const imageHash = document.getElementById("imageHash").value;

    if (!name || !category || !price || !stock || !imageHash) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const transaction = await contract.addProduct(
            name,
            category,
            ethers.utils.parseEther(price), // Convert ETH to wei
            stock,
            imageHash
        );
        await transaction.wait();
        alert("Product added successfully!");
        loadProducts();
    } catch (error) {
        console.error("Failed to add product:", error);
        alert("Failed to add product. Check console for details.");
    }
}

// Attach event listener AFTER defining the function
document.getElementById("add-product-btn").addEventListener("click", addProduct);
document.getElementById("connect-btn").addEventListener("click", connectWallet);

