// script.js
console.log('ethers:', typeof ethers);
// Firebase configuration (ganti dengan konfigurasi proyek Firebase Anda)
const firebaseConfig = {
  apiKey: "AIzaSyAmfQ6Vf-17VBmDOYT3giWPsocDpWt_dQs",
  authDomain: "sistem-vote-terdesentralisasi.firebaseapp.com",
  projectId: "sistem-vote-terdesentralisasi",
  storageBucket: "sistem-vote-terdesentralisasi.firebasestorage.app",
  messagingSenderId: "356442724704",
  appId: "1:356442724704:web:1379eee5b5ffe30a466605"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// URL backend (PHP API)
const backendUrl = "api.php"; // File api.php di server PHP Anda

// Detail smart contract (contoh)
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Ganti dengan address smart contract sebenarnya
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "candidateNames",
				"type": "string[]"
			},
			{
				"internalType": "uint256",
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "createPoll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "trustedForwarder",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "PollCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
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
				"name": "pollId",
				"type": "uint256"
			}
		],
		"name": "getCandidateCount",
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
				"name": "pollId",
				"type": "uint256"
			}
		],
		"name": "getPollDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "candidateCount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			}
		],
		"name": "getRealTimeVotes",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "voteCounts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pollId",
				"type": "uint256"
			}
		],
		"name": "getWinner",
		"outputs": [
			{
				"internalType": "string",
				"name": "winnerName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
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
				"name": "forwarder",
				"type": "address"
			}
		],
		"name": "isTrustedForwarder",
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
		"inputs": [],
		"name": "pollCount",
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
		"name": "trustedForwarder",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
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
    // Setelah registrasi, buat wallet secara otomatis via backend
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
    // Cek apakah wallet sudah ada untuk user ini
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
    // Tampilkan bagian voting setelah login
    document.getElementById("voteSection").style.display = "block";
  } catch (error) {
    document.getElementById("loginMessage").innerText = error.message;
  }
});

// Voting: Encode fungsi vote dan proses meta-transaction melalui backend
document.getElementById("voteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pollId = parseInt(document.getElementById("pollId").value);
const candidateId = parseInt(document.getElementById("candidateId").value);

if (isNaN(pollId) || isNaN(candidateId) || candidateId < 0) {
  document.getElementById("voteMessage").innerText = "ID Poll dan ID Kandidat harus berupa angka!";
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
