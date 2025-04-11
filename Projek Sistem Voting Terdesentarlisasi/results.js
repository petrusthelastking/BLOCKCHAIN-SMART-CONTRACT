// results.js

// Konfigurasi smart contract untuk fungsi getWinner
const contractAddress = "Alamat SmartContract Anda"; // Ganti dengan address smart contract sebenarnya
const contractABI = [
	// ABI dari smart contract Anda di sini
];
const resultsInterface = new ethers.utils.Interface(resultsABI);

document.getElementById("resultsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const pollId = parseInt(document.getElementById("resultPollId").value);
  
  if (isNaN(pollId)) {
    document.getElementById("resultsDisplay").innerText = "ID Poll harus berupa angka!";
    return;
  }
  
  const functionData = resultsInterface.encodeFunctionData("getWinner", [pollId]);
  
  try {
    // Panggil backend untuk membaca data dari smart contract
    const response = await fetch("api.php?endpoint=getWinner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractAddress: contractAddress,
        functionData: functionData
      })
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById("resultsDisplay").innerText =
        `Pemenang: ${result.winnerName} dengan ${result.voteCount} suara.`;
    } else {
      document.getElementById("resultsDisplay").innerText = result.error || "Gagal mengambil hasil.";
    }
  } catch (error) {
    document.getElementById("resultsDisplay").innerText = error.message;
  }
});

// Tombol Share
document.getElementById("shareButton").addEventListener("click", () => {
  const shareUrl = window.location.href; // URL halaman results.html
  if (navigator.share) {
    navigator.share({
      title: "Hasil Voting",
      text: "Lihat hasil voting saya di sini:",
      url: shareUrl,
    })
    .then(() => console.log("Berhasil share"))
    .catch((error) => console.error("Gagal share", error));
  } else {
    // Fallback: copy ke clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("URL telah dicopy ke clipboard!"))
      .catch((err) => console.error("Gagal copy URL", err));
  }
});
