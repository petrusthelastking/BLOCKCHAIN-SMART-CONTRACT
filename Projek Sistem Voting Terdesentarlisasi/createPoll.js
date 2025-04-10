// createPoll.js

// Konfigurasi smart contract untuk fungsi createPoll
const contractAddress = "Alamat SmartContract Anda"; // Ganti dengan address smart contract sebenarnya
const contractABI = [
	// ABI dari smart contract Anda di sini
];
const contractInterface = new ethers.utils.Interface(contractABI);

// Event listener untuk form create poll
document.getElementById("createPollForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("pollTitle").value.trim();
  const candidatesStr = document.getElementById("candidates").value.trim();
  const startTime = parseInt(document.getElementById("startTime").value);
  const endTime = parseInt(document.getElementById("endTime").value);

  if (!title || !candidatesStr || isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
    document.getElementById("createPollMessage").innerText = "Pastikan semua field terisi dengan benar dan waktu mulai < waktu berakhir.";
    return;
  }

  // Ubah daftar kandidat menjadi array
  const candidateNames = candidatesStr.split(",").map(name => name.trim()).filter(name => name !== "");

  const functionData = contractInterface.encodeFunctionData("createPoll", [title, candidateNames, startTime, endTime]);

  try {
    // Contoh: kirim transaksi ke backend untuk pembuatan poll (metode meta-transaction)
    const response = await fetch("api.php?endpoint=createPoll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metaTx: {
          contractAddress: contractAddress,
          functionData: functionData,
          // from: alamat wallet organizer (jika diperlukan)
        }
      })
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById("createPollMessage").innerText = "Poll berhasil dibuat!";
    } else {
      document.getElementById("createPollMessage").innerText = result.error || "Gagal membuat poll.";
    }
  } catch (error) {
    document.getElementById("createPollMessage").innerText = error.message;
  }
});
