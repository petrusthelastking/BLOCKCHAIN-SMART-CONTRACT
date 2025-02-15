// script.js

// Ganti dengan alamat kontrak ArtToken Anda (dari Remix atau Etherscan Sepolia)
const contractAddress = "0xff79ad37a13b01fbf29df4a4281ec364275a6863";

// Ganti dengan ABI kontrak ArtToken Anda (ambil dari Remix atau Etherscan)
const contractABI = [
  // Contoh ABI minimal:
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setTokenPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}
];

let provider;
let signer;
let artTokenContract;

/**
 * Fungsi untuk menghubungkan wallet dengan window.ethereum.
 * Digunakan untuk desktop atau ketika pengguna sudah berada di dalam MetaMask.
 */
async function connectWallet() {
  if (window.ethereum) {
    try {
      // Meminta akses ke akun pengguna
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      document.getElementById("walletAddress").innerText = `Wallet: ${userAddress}`;
      
      // Inisialisasi kontrak dengan alamat dan ABI
      artTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
      document.getElementById("status").innerText = "Wallet connected!";
    } catch (error) {
      console.error("Error connecting wallet:", error);
      document.getElementById("status").innerText = "Error connecting wallet. Lihat console untuk detail.";
    }
  } else {
    alert("MetaMask tidak terdeteksi. Silakan install MetaMask.");
  }
}

/**
 * Fungsi untuk membeli token.
 */
async function buyTokens() {
  const tokenAmountInput = document.getElementById("tokenAmount").value;
  if (!tokenAmountInput || tokenAmountInput <= 0) {
    alert("Masukkan jumlah token yang valid.");
    return;
  }
  try {
    // Ambil harga token dari kontrak (dengan tipe BigNumber)
    const tokenPrice = await artTokenContract.tokenPrice();
    
    // Konversi input jumlah token ke BigNumber (diasumsikan tanpa desimal tambahan)
    const tokenAmount = ethers.BigNumber.from(tokenAmountInput);
    
    // Hitung total ETH yang diperlukan: tokenPrice * tokenAmount
    const amountToSend = tokenPrice.mul(tokenAmount);
    
    document.getElementById("status").innerText = "Transaksi sedang diproses...";
    
    // Panggil fungsi buyTokens pada kontrak dengan jumlah token dan kirim ETH yang diperlukan
    const tx = await artTokenContract.buyTokens(tokenAmount, { value: amountToSend });
    await tx.wait();
    document.getElementById("status").innerText = "Token berhasil dibeli!";
  } catch (error) {
    console.error("Error buying tokens:", error);
    document.getElementById("status").innerText = "Transaksi gagal. Lihat console untuk detail.";
  }
}

/**
 * Fungsi untuk mengecek saldo token pengguna.
 */
async function checkBalance() {
  if (!signer || !artTokenContract) {
    alert("Wallet belum terhubung. Silakan klik 'Connect Wallet' terlebih dahulu.");
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

/**
 * Fungsi untuk mendeteksi apakah perangkat yang digunakan adalah mobile.
 */
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Fungsi untuk menangani koneksi wallet.
 * - Jika pengguna membuka dApp di browser biasa pada perangkat mobile,
 *   maka langsung diarahkan ke deep link MetaMask.
 * - Jika sudah berada di dalam MetaMask (in-app browser) atau menggunakan desktop,
 *   maka jalankan fungsi connectWallet() secara normal.
 */
function handleConnectWallet() {
  if (isMobile()) {
    // Jika di dalam MetaMask in-app browser, biasanya window.ethereum sudah tersedia dan
    // window.ethereum.isMetaMask bernilai true.
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Sudah berada di dalam browser MetaMask, langsung connect wallet
      connectWallet();
    } else {
      // Jika belum di dalam MetaMask, redirect ke deep link MetaMask.
      // Ganti 'yourdomain.com' dengan domain dApp Anda, misalnya 'arttokenmarketplace.com'
      const metamaskDeepLink = "https://metamask.app.link/dapp/alleviateweb.my.id/UITokenKaryaSeni.html";
      window.location.href = metamaskDeepLink;
    }
  } else {
    // Desktop: langsung panggil connectWallet()
    connectWallet();
  }
}

/**
 * Saat halaman dimuat, cek apakah wallet sudah tersambung (misalnya, jika dApp dibuka di dalam MetaMask)
 */
window.addEventListener("load", async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        document.getElementById("walletAddress").innerText = `Wallet: ${accounts[0]}`;
        artTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("status").innerText = "Wallet already connected!";
      }
    } catch (error) {
      console.error("Error checking wallet connection on load:", error);
    }
  }
});

// Event listener untuk tombol-tombol di halaman HTML
document.getElementById("connectWalletBtn").addEventListener("click", handleConnectWallet);
document.getElementById("buyTokenBtn").addEventListener("click", buyTokens);
document.getElementById("checkBalanceBtn").addEventListener("click", checkBalance);