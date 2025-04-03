// === Konfigurasi Kontrak ===
const contractAddress = "0xff79ad37a13b01fbf29df4a4281ec364275a6863";
const contractABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},
  {"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},
  {"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenPurchased","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
  {"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setTokenPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

let provider;
let signer;
let artTokenContract;
let fullWalletAddress = null;

// Konstanta untuk interval candle (misalnya 1 menit = 60000 ms)
const CANDLE_INTERVAL = 60000;

// Misalnya, data awal candle diinisialisasi seperti berikut (dengan nilai dasar 100):
if (!window.candlestickData) {
  const now = Date.now();
  window.candlestickData = [{
    o: 100,
    h: 100,
    l: 100,
    c: 100,
    x: now
  }];
}

// === Tambahkan Kode Provider WebSocket Infura di Sini ===
// Pastikan Anda memiliki API key Infura (ganti "YOUR_INFURA_API_KEY" dengan API key asli)
const INFURA_API_KEY = "2a88a7ff1bfb4729bde6df8ad855e49d";  
const wsProvider = new ethers.providers.WebSocketProvider(
  `wss://sepolia.infura.io/ws/v3/${INFURA_API_KEY}`
);

const START_BLOCK = 0; // Ganti dengan block deployment sebenarnya jika perlu
async function resyncEventsFromChain() {
  if (!orderBookContract) return;

  let lastScannedBlock = localStorage.getItem("lastScannedBlock") || START_BLOCK;
  let currentBlock = await wsProvider.getBlockNumber();

  let filter = orderBookContract.filters.TokenPurchased();
  let events = await orderBookContract.queryFilter(
    filter,
    Number(lastScannedBlock),
    currentBlock
  );

  for (const event of events) {
    let buyer = event.args.buyer;
    let amountBN = event.args.amount;
    let txHash = event.transactionHash;
    addOrderBookEntry(buyer, amountBN, txHash);

    const tokenAmountFloat = parseFloat(ethers.utils.formatEther(amountBN));
    updateCandlestickForPurchase(tokenAmountFloat.toString());
  }

  localStorage.setItem("lastScannedBlock", currentBlock);
  console.log("Re-scan event selesai. Block:", currentBlock);
}

// Kemudian, di dalam DOMContentLoaded, panggil fungsi ini:
document.addEventListener("DOMContentLoaded", async function() {
  // Panggil fungsi resyncEventsFromChain() agar data diperbarui saat load
  await resyncEventsFromChain();

  // Sisanya: inisialisasi event listener dan logic lainnya
});

// Gunakan wsProvider untuk membuat instance kontrak agar mendapatkan event secara real-time
artTokenContract = new ethers.Contract(contractAddress, contractABI, wsProvider);

// Fungsi pembantu untuk UI
function getShortAddress(address) {
  return address.slice(0, 10) + "..." + address.slice(-4);
}

function updateWalletUI(address) {
  document.getElementById("walletAddress").innerText = "Wallet: " + getShortAddress(address);
}

function updateCandlestickForPurchase(tokenAmountInputValue) {
  const now = Date.now();
  // Gunakan nilai input langsung sebagai jumlah token (angka manusiawi)
  const tokenAmountFloat = parseFloat(tokenAmountInputValue);
  
  // Atur scaling factor yang sesuai agar kenaikan terlihat signifikan
  const scalingFactor = 100; // Sesuaikan nilainya sesuai kebutuhan
  const increment = tokenAmountFloat * scalingFactor;
  
  // Ambil candle terakhir sebagai dasar
  let lastCandle = window.candlestickData[window.candlestickData.length - 1];
  
  // (Opsional) Tambahkan variasi acak kecil agar tidak simetris sempurna
  const randomFluctuation = (Math.random() - 0.5) * 10; // nilai antara -5 dan +5
  
  // Hitung nilai close baru
  const newClose = lastCandle.c + increment + randomFluctuation;
  
  // Tambahkan "wick buffer" agar candle memiliki body dan wick yang jelas
  const wickBuffer = Math.abs(randomFluctuation) + 20;
  
  // Buat candle baru
  const newCandle = {
    o: lastCandle.c,
    c: newClose,
    h: Math.max(lastCandle.c, newClose) + wickBuffer,
    l: Math.min(lastCandle.c, newClose) - wickBuffer,
    x: now
  };
  
  // Tambahkan candle baru ke data
  window.candlestickData.push(newCandle);
  
  // Batasi jumlah candle, misalnya maksimal 10
  if (window.candlestickData.length > 10) {
    window.candlestickData.shift();
  }
  
  // Simpan data ke localStorage
  localStorage.setItem('candlestickData', JSON.stringify(window.candlestickData));
  
  // Update chart
  if (window.transactionChart) {
    window.transactionChart.update();
  }
  
  console.log("Candle terbaru:", newCandle);
}

// Fungsi untuk menghubungkan wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      fullWalletAddress = await signer.getAddress();
      updateWalletUI(fullWalletAddress);
      document.getElementById("connectWalletBtn").style.display = "none";
      const heroConnectBtnBuy = document.getElementById("heroConnectBtnBuy");
      if (heroConnectBtnBuy) {
        heroConnectBtnBuy.style.display = "none";
      }
      artTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
      document.getElementById("status").innerText = "Wallet connected!";

      // Pasang event listener untuk event TokenPurchased
      artTokenContract.on("TokenPurchased", (buyer, amount, event) => {
        console.log("TokenPurchased event diterima:", buyer, amount.toString());
        // Konversi jumlah token dari wei ke desimal (sesuai asumsi 18 desimal)
        const tokenAmount = parseFloat(ethers.utils.formatEther(amount));
        updateCandlestickForPurchase(tokenAmount);
      });

    } catch (error) {
      console.error("Error connecting wallet:", error);
      document.getElementById("status").innerText = "Error connecting wallet. Lihat console untuk detail.";
    }
  } else {
    alert("MetaMask tidak terdeteksi. Silakan install MetaMask.");
  }
}

// Fungsi untuk membeli token
async function buyTokens() {
  const tokenAmountInput = document.getElementById("tokenAmount").value;
  if (!tokenAmountInput || tokenAmountInput <= 0) {
    alert("Masukkan jumlah token yang valid.");
    return;
  }
  try {
    const tokenPrice = await artTokenContract.tokenPrice();
    const tokenAmount = ethers.BigNumber.from(tokenAmountInput);
    const amountToSend = tokenPrice.mul(tokenAmount);
    document.getElementById("status").innerText = "Transaksi sedang diproses...";
    
    // Kirim transaksi pembelian token
    const tx = await artTokenContract.buyTokens(tokenAmount, { value: amountToSend });
    await tx.wait();
    document.getElementById("status").innerText = "Token berhasil dibeli!";
    
    // Optimistic UI update: gunakan nilai input langsung
    updateCandlestickForPurchase(tokenAmountInput);
  } catch (error) {
    console.error("Error buying tokens:", error);
    document.getElementById("status").innerText = "Transaksi gagal. Lihat console untuk detail.";
  }
}


// Fungsi untuk mengecek saldo token
async function checkBalance() {
  if (!signer || !artTokenContract) {
    alert("Wallet belum terhubung! Silakan klik 'Connect Wallet' terlebih dahulu.");
    return;
  }
  try {
    const userAddress = await signer.getAddress();
    const balance = await artTokenContract.balanceOf(userAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    document.getElementById("balanceDisplay").innerText = `Saldo token: ${formattedBalance}`;
  } catch (error) {
    console.error("Error checking balance:", error);
    document.getElementById("balanceDisplay").innerText = "Gagal mengambil saldo token.";
  }
}

// Fungsi untuk mendeteksi perangkat mobile
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
function handleConnectWallet() {
  if (isMobile()) {
    if (window.ethereum && window.ethereum.isMetaMask) {
      connectWallet();
    } else {
      const metamaskDeepLink = "https://metamask.app.link/dapp/alleviateweb.my.id/UITokenKaryaSeni.html";
      window.location.href = metamaskDeepLink;
    }
  } else {
    connectWallet();
  }
}

// Event listener saat DOM telah termuat
document.addEventListener("DOMContentLoaded", function() {
  const storedData = localStorage.getItem('candlestickData');
  if (storedData) {
    window.candlestickData = JSON.parse(storedData);
  } else {
    // Jika tidak ada data tersimpan, inisialisasi dengan data default
    const initialPrice = 100;
    const now = new Date().getTime();
    window.candlestickData = [{
      o: 100,
      h: 110,
      l: 95,
      c: 105,
      x: new Date().getTime()
    }];       
    localStorage.setItem('candlestickData', JSON.stringify(window.candlestickData));
  }

  // Navigasi antar section
  const homeLink = document.getElementById("homeLink");
  const buyLink = document.getElementById("buyLink");
  const tutorialLink = document.getElementById("tutorialLink");
  const homeSection = document.getElementById("home-section");
  const buySection = document.getElementById("buy-section");
  const tutorialSection = document.getElementById("tutorial-section");

  homeLink.addEventListener("click", function(e) {
    e.preventDefault();
    homeSection.classList.add("active");
    buySection.classList.remove("active");
    tutorialSection.classList.remove("active");
    homeLink.classList.add("active");
    buyLink.classList.remove("active");
    tutorialLink.classList.remove("active");
  });

  buyLink.addEventListener("click", function(e) {
    e.preventDefault();
    buySection.classList.add("active");
    homeSection.classList.remove("active");
    tutorialSection.classList.remove("active");
    buyLink.classList.add("active");
    homeLink.classList.remove("active");
    tutorialLink.classList.remove("active");
  });

  tutorialLink.addEventListener("click", function(e) {
    e.preventDefault();
    tutorialSection.classList.add("active");
    homeSection.classList.remove("active");
    buySection.classList.remove("active");
    tutorialLink.classList.add("active");
    homeLink.classList.remove("active");
    buyLink.classList.remove("active");
  });
  
  // Inisialisasi AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
  
  // Inisialisasi chart candlestick dengan window.candlestickData
  const ctx = document.getElementById('transactionChart');
  if (ctx) {
    window.transactionChart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: 'Aktivitas Token (Candlestick)',
          data: window.candlestickData,
          color: {
            up: '#00e676',
            down: '#ff1744',
            unchanged: '#9e9e9e'
          }
        }]
      },
      ooptions: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'minute' },
            ticks: { color: '#e0e0e0' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            min: 0,       // Atur nilai minimum sesuai kebutuhan
            max: 12000,   // Sesuaikan nilai maksimum agar candle tampak proporsional
            ticks: { color: '#e0e0e0' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }      
    });
  } else {
    console.error("Elemen canvas dengan id 'transactionChart' tidak ditemukan.");
  }
});

// Cek koneksi wallet saat halaman dimuat
window.addEventListener("load", async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        fullWalletAddress = accounts[0];
        updateWalletUI(fullWalletAddress);
        artTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("status").innerText = "Wallet already connected!";
        document.getElementById("connectWalletBtn").style.display = "none";
        const heroConnectBtnBuy = document.getElementById("heroConnectBtnBuy");
        if (heroConnectBtnBuy) heroConnectBtnBuy.style.display = "none";
      }
    } catch (error) {
      console.error("Error checking wallet connection on load:", error);
    }
  }
});

// Pasang event listener untuk tombol Connect Wallet, Beli Token, dan Cek Saldo
document.getElementById("connectWalletBtn").addEventListener("click", handleConnectWallet);
const heroConnectBtnBuy = document.getElementById("heroConnectBtnBuy");
if (heroConnectBtnBuy) {
  heroConnectBtnBuy.addEventListener("click", handleConnectWallet);
}
document.getElementById("buyTokenBtn").addEventListener("click", buyTokens);
document.getElementById("checkBalanceBtn").addEventListener("click", checkBalance);


// === Kode Tambahan Fitur Order Book ===

// Variabel global untuk menyimpan data order book
if (!window.orderBookEntries) {
  window.orderBookEntries = [];
}

// Fungsi untuk memperbarui tampilan Order Book dalam bentuk tabel
function updateOrderBookUI() {
  const tbody = document.querySelector("#orderbookTable tbody");
  if (!tbody) return;
  tbody.innerHTML = ""; // Bersihkan isi tabel

  window.orderBookEntries.forEach(entry => {
    const tr = document.createElement("tr");

    const tdTime = document.createElement("td");
    tdTime.innerText = entry.time;
    tr.appendChild(tdTime);

    const tdBuyer = document.createElement("td");
    tdBuyer.innerText = entry.buyer;
    tr.appendChild(tdBuyer);

    const tdAmount = document.createElement("td");
    tdAmount.innerText = entry.amount;
    tr.appendChild(tdAmount);

    tbody.appendChild(tr);
  });
}

// Fungsi untuk menambahkan entri baru ke Order Book
function addOrderBookEntry(buyer, amount, txHash) {
  // Jika txHash sudah tercatat, hindari duplikasi
  if (txHash) {
    const exists = window.orderBookEntries.some(entry => entry.txHash === txHash);
    if (exists) return;
  }
  const now = new Date().toLocaleString();
  // Format alamat pembeli secara singkat
  const shortBuyer = buyer.slice(0, 10) + "..." + buyer.slice(-4);
  // Format jumlah token dari wei ke desimal (asumsi 18 desimal)
  const formattedAmount = ethers.utils.formatEther(amount);
  const newEntry = {
    time: now,
    buyer: shortBuyer,
    amount: formattedAmount,
    txHash: txHash
  };
  // Tambahkan entri di awal array (order terbaru di atas)
  window.orderBookEntries.unshift(newEntry);
  // Opsional: batasi jumlah entri (misalnya maksimal 50)
  if (window.orderBookEntries.length > 50) {
    window.orderBookEntries.pop();
  }
  // Simpan data Order Book ke localStorage
  localStorage.setItem('orderBookEntries', JSON.stringify(window.orderBookEntries));
  updateOrderBookUI();
}

// Fungsi untuk memuat data Order Book dari localStorage saat halaman dimuat
function loadOrderBook() {
  const stored = localStorage.getItem('orderBookEntries');
  if (stored) {
    window.orderBookEntries = JSON.parse(stored);
    updateOrderBookUI();
  }
}

// Panggil loadOrderBook saat DOM telah termuat
document.addEventListener("DOMContentLoaded", async function() {
  // ... kode existing DOMContentLoaded ...
  
  // Setelah inisialisasi kontrak
  if (!window.orderBookContract) {
    window.orderBookContract = new ethers.Contract(contractAddress, contractABI, wsProvider);
  }

  // Re-scan event dari chain
  await resyncEventsFromChain();

  // Pasang listener real-time
  if (!window.orderBookEventListenerAdded) {
    orderBookContract.on("TokenPurchased", (buyer, amount, event) => {
      console.log("Real-time event:", buyer, amount.toString());
      addOrderBookEntry(buyer, amount, event.transactionHash);
      const tokenAmountFloat = parseFloat(ethers.utils.formatEther(amount));
      updateCandlestickForPurchase(tokenAmountFloat.toString());
    });
    window.orderBookEventListenerAdded = true;
  }
});
