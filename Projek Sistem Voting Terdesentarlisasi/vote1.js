// vote.js

// Konfigurasi backend (file PHP)
const backendUrl = "api1.php"; // Pastikan file ini berada di root server PHP Anda

// Konfigurasi smart contract (ganti dengan nilai yang benar)
const contractAddress = "Alamat SmartContract Anda"; // Ganti dengan address smart contract sebenarnya
const contractABI = [
	// ABI dari smart contract Anda di sini
];
const contractInterface = new ethers.utils.Interface(contractABI);

let currentUser = null; // Firebase user
let userWalletAddress = ""; // Custodial wallet address

// Fungsi helper untuk memanggil endpoint backend via PHP
function myFetch(endpoint, data) {
  return fetch(`${backendUrl}?endpoint=${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// Registrasi
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    // Setelah registrasi, buat wallet otomatis via backend
    const res = await myFetch("createWallet", { uid: currentUser.uid, email: email });
    const result = await res.json();
    if (res.ok) {
      userWalletAddress = result.address;
      document.getElementById("regMessage").innerText = `Registrasi berhasil! Wallet: ${userWalletAddress}`;
    } else {
      document.getElementById("regMessage").innerText = result.error;
    }
  } catch (error) {
    document.getElementById("regMessage").innerText = error.message;
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    // Cek apakah wallet sudah ada
    const res = await myFetch("getWallet", { uid: currentUser.uid });
    const result = await res.json();
    if (res.ok && result.walletExists) {
      userWalletAddress = result.address;
      document.getElementById("loginMessage").innerText = `Login berhasil! Wallet: ${userWalletAddress}`;
    } else {
      // Jika belum ada, buat wallet baru
      const resCreate = await myFetch("createWallet", { uid: currentUser.uid, email: email });
      const resultCreate = await resCreate.json();
      if (resCreate.ok) {
        userWalletAddress = resultCreate.address;
        document.getElementById("loginMessage").innerText = `Login berhasil! Wallet: ${userWalletAddress}`;
      } else {
        document.getElementById("loginMessage").innerText = resultCreate.error;
      }
    }
    // Tampilkan form voting
    document.getElementById("voteSection").style.display = "block";
  } catch (error) {
    document.getElementById("loginMessage").innerText = error.message;
  }
});

// Voting: Encode fungsi vote dan proses meta-transaction melalui backend
document.getElementById("voteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Konversi nilai input ke integer
  const pollId = parseInt(document.getElementById("pollId").value);
  const candidateId = parseInt(document.getElementById("candidateId").value);
  
  if (isNaN(pollId) || isNaN(candidateId) || candidateId < 0) {
    document.getElementById("voteMessage").innerText = "ID Poll dan ID Kandidat harus berupa angka positif!";
    return;
  }
  
  const functionData = contractInterface.encodeFunctionData("vote", [pollId, candidateId]);
  
  try {
    // Minta backend untuk menandatangani meta-transaction
    const resSign = await myFetch("signMetaTx", {
      uid: currentUser.uid,
      functionData: functionData,
      contractAddress: contractAddress
    });
    const resultSign = await resSign.json();
    if (!resSign.ok) {
      document.getElementById("voteMessage").innerText = resultSign.error;
      return;
    }
    const signature = resultSign.signature;
    
    // Forward meta-transaction ke blockchain via backend
    const resForward = await myFetch("forwardTx", {
      metaTx: {
        contractAddress: contractAddress,
        functionData: functionData,
        from: userWalletAddress
      },
      signature: signature
    });
    const resultForward = await resForward.json();
    if (resForward.ok) {
      document.getElementById("voteMessage").innerText = "Voting berhasil dikirim!";
    } else {
      document.getElementById("voteMessage").innerText = resultForward.error;
    }
  } catch (error) {
    document.getElementById("voteMessage").innerText = error.message;
  }
});
