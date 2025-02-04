let provider;
let signer;
let contract = null;
let userAddress;
const contractAddress = "0x7da05a2c8cfd0456d1bab1bdaff794e3f538865b";
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
				"name": "_productId",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "deleteProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "forceDeleteProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"indexed": true,
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
				"indexed": true,
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
			}
		],
		"name": "ProductAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "ProductDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
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
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			}
		],
		"name": "ProductUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_email",
				"type": "string"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TransactionCompleted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newImageHash",
				"type": "string"
			}
		],
		"name": "updateProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
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
		"name": "getMyEmail",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userCount",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];


//////////////////////////////
// Fungsi Utilitas
//////////////////////////////
function shortenAddress(address) {
	return address.slice(0, 6) + "..." + address.slice(-4);
  }
  
  //////////////////////////////
  // Fungsi Connect & Registrasi (digabungkan)
  //////////////////////////////
  async function connectAndRegister() {
	try {
	  if (typeof window.ethereum === 'undefined') {
		alert('Silakan install MetaMask!');
		return;
	  }
  
	  provider = new ethers.providers.Web3Provider(window.ethereum);
	  await provider.send("eth_requestAccounts", []);
	  signer = provider.getSigner();
	  userAddress = await signer.getAddress();
  
	  // Inisialisasi kontrak dengan signer
	  contract = new ethers.Contract(contractAddress, abi, signer);
  
	  // Update tampilan wallet
	  document.getElementById('connect-btn').style.display = 'none';
	  document.getElementById('wallet-profile').style.display = 'flex';
	  document.getElementById('profile-address').innerText = shortenAddress(userAddress);
  
	  // Cek status registrasi
	  const isReg = await contract.isRegistered(userAddress);
	  if (!isReg) {
		// Jika belum terdaftar, minta input email melalui prompt dan lakukan registrasi
		const email = prompt("Anda belum terdaftar. Masukkan email untuk registrasi:");
		if (!email) {
		  alert("Email diperlukan untuk registrasi.");
		  return;
		}
		const tx = await contract.register(email);
		await tx.wait();
		alert("Registrasi berhasil!");
	  }
  
	  // Tampilkan konten utama (landing page)
	  document.getElementById('main-content').style.display = 'block';
	  await loadProducts();
	  await loadTransactionHistory();
	  await checkAdminRole();
	} catch (error) {
	  console.error('Error saat menghubungkan wallet dan registrasi:', error);
	  alert(`Error: ${error.message.split('(')[0]}`);
	}
  }
  
  document.addEventListener('DOMContentLoaded', () => {
	const connectBtn = document.getElementById('connect-btn');
	if (connectBtn) {
	  connectBtn.addEventListener('click', connectAndRegister);
	}
	const addProductBtn = document.getElementById('add-product-btn');
	if (addProductBtn) {
	  addProductBtn.addEventListener('click', addProduct);
	}
  });
  
  //////////////////////////////
  // Fungsi Produk & Transaksi
  //////////////////////////////
  async function addProduct() {
	try {
	  // Hanya admin yang bisa menambah produk
	  const owner = await contract.admin();
	  if (userAddress.toLowerCase() !== owner.toLowerCase()) {
		alert("Hanya admin yang dapat menambahkan produk.");
		return;
	  }
	
	  const name = document.getElementById('name').value.trim();
	  const category = document.getElementById('category').value.trim();
	  const price = ethers.utils.parseEther(document.getElementById('price').value);
	  const stock = parseInt(document.getElementById('stock').value);
	  const imageHash = document.getElementById('imageHash').value.trim();
  
	  if (!name || !category || !price || !stock || !imageHash) {
		throw new Error('Semua field harus diisi!');
	  }
  
	  const tx = await contract.addProduct(name, category, price, stock, imageHash);
	  await tx.wait();
  
	  alert('Produk berhasil ditambahkan!');
	  await loadProducts();
	} catch (error) {
	  console.error('Error tambah produk:', error);
	  alert(`Gagal: ${error.message.split('(')[0]}`);
	}
  }
  
  window.buyProduct = async (productId) => {
	try {
	  const product = await contract.products(productId);
	  const quantity = prompt('Masukkan jumlah:');
	  if (!quantity || isNaN(quantity)) return;
  
	  const totalPrice = product.price.mul(quantity);
	  const tx = await contract.buyProduct(productId, quantity, { value: totalPrice });
	  await tx.wait();
  
	  alert('Pembelian berhasil!');
	  await loadProducts();
	  await loadTransactionHistory();
	} catch (error) {
	  console.error('Error pembelian:', error);
	  alert(`Gagal: ${error.message.split('(')[0]}`);
	}
  };
  
  window.deleteProduct = async (productId) => {
	try {
	  const tx = await contract.deleteProduct(productId);
	  await tx.wait();
	  alert('Produk berhasil dihapus!');
	  await loadProducts();
	} catch (error) {
	  console.error('Error hapus produk:', error);
	  alert(`Gagal: ${error.message.split('(')[0]}`);
	}
  };
  
  window.forceDeleteProduct = async (productId) => {
	try {
	  const tx = await contract.forceDeleteProduct(productId);
	  await tx.wait();
	  alert('Produk berhasil dihapus oleh admin!');
	  await loadProducts();
	} catch (error) {
	  console.error('Error hapus produk (admin):', error);
	  alert(`Gagal: ${error.message.split('(')[0]}`);
	}
  };
  
  async function loadProducts() {
	try {
	  const productList = document.getElementById('product-list');
	  if (!productList) {
		console.error("Elemen 'product-list' tidak ditemukan.");
		return;
	  }
	  productList.innerHTML = '';
  
	  const productCount = await contract.productCount();
	  for (let i = 1; i <= productCount; i++) {
		const product = await contract.products(i);
		// Lewati produk yang sudah dihapus (misalnya jika id-nya 0)
		if (product.id.toString() === '0') continue;
  
		let deleteButtonHTML = "";
		// Jika produk dimiliki oleh user, tampilkan tombol hapus
		if (product.owner.toLowerCase() === userAddress.toLowerCase()) {
		  deleteButtonHTML = `<button class="action-btn" onclick="window.deleteProduct(${i})">Hapus Produk</button>`;
		}
		// Jika admin dan produk bukan milik user, berikan opsi force delete
		const owner = await contract.admin();
		if (userAddress.toLowerCase() === owner.toLowerCase() && product.owner.toLowerCase() !== userAddress.toLowerCase()) {
		  deleteButtonHTML += `<button class="action-btn" onclick="window.forceDeleteProduct(${i})">Force Delete</button>`;
		}
  
		const productElement = document.createElement('div');
		productElement.className = 'masonry-item';
		productElement.innerHTML = `
		  <div class="product-card">
			<div class="img-container">
			  <img src="NIke.jpeg" class="product-image" alt="${product.name}">
			  <div class="overlay">
				<button class="action-btn" onclick="window.buyProduct(${i})" ${product.stock <= 0 ? 'disabled' : ''}>
				  ${product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
				</button>
			  </div>
			</div>
			<div class="product-info">
			  <h3>${product.name}</h3>
			  <p>Kategori: ${product.category}</p>
			  <p>Harga: ${ethers.utils.formatEther(product.price)} ETH</p>
			  <p>Stok: ${product.stock}</p>
			  ${deleteButtonHTML}
			</div>
		  </div>
		`;
		productList.appendChild(productElement);
	  }
	} catch (error) {
	  console.error('Gagal memuat produk:', error);
	}
  }
  
  async function loadTransactionHistory() {
	try {
	  const transactionList = document.getElementById('transaction-list');
	  if (!transactionList) return;
	  transactionList.innerHTML = 'Loading riwayat...';
  
	  const filter = contract.filters.TransactionCompleted(userAddress);
	  const events = await contract.queryFilter(filter);
	  transactionList.innerHTML = '';
  
	  for (const event of events.reverse()) {
		const product = await contract.products(event.args.productId);
		const transactionDate = new Date(event.args.timestamp * 1000);
		transactionList.innerHTML += `
		  <div class="transaction-item">
			<img src="https://ipfs.io/ipfs/${product.imageHash}" class="transaction-image" alt="${product.name}">
			<div>
			  <h4>${product.name}</h4>
			  <p>Kategori: ${product.category}</p>
			</div>
			<div>
			  <p>${event.args.quantity}x</p>
			  <small>Jumlah</small>
			</div>
			<div>
			  <p>${ethers.utils.formatEther(event.args.totalPrice)} ETH</p>
			  <small>Total</small>
			</div>
			<div>
			  <p>${transactionDate.toLocaleDateString()}</p>
			  <small>Tanggal</small>
			</div>
		  </div>
		`;
	  }
	} catch (error) {
	  console.error('Gagal memuat riwayat transaksi:', error);
	  const transactionList = document.getElementById('transaction-list');
	  if (transactionList) {
		transactionList.innerHTML = 'Gagal memuat riwayat transaksi';
	  }
	}
  }
  
  async function checkAdminRole() {
	try {
	  const owner = await contract.admin();
	  const adminSection = document.getElementById('add-product-section');
	  const menuAdd = document.getElementById('menu-add'); // Pastikan elemen ini ada jika digunakan
	  if (userAddress.toLowerCase() === owner.toLowerCase()) {
		if (adminSection) adminSection.style.display = 'block';
		if (menuAdd) menuAdd.style.display = 'inline-block';
	  } else {
		if (adminSection) adminSection.style.display = 'none';
		if (menuAdd) menuAdd.style.display = 'none';
	  }
	} catch (error) {
	  console.error('Error cek role admin:', error);
	}
  }

