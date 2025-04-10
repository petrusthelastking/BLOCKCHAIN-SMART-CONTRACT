<?php
// api.php
header('Content-Type: application/json');
session_start();

// Inisialisasi array wallet di session jika belum ada
if (!isset($_SESSION['wallets'])) {
    $_SESSION['wallets'] = [];
}

// Ambil endpoint dari query string
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$data = json_decode(file_get_contents("php://input"), true);

// Fungsi helper untuk kirim response JSON
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Simulasi endpoint
switch ($endpoint) {
    case "createWallet":
        $uid = isset($data['uid']) ? $data['uid'] : '';
        if (!$uid) {
            sendResponse(["error" => "UID tidak diberikan"], 400);
        }
        if (isset($_SESSION['wallets'][$uid])) {
            sendResponse([
                "address" => $_SESSION['wallets'][$uid]['address'],
                "message" => "Wallet sudah ada"
            ]);
        }
        // Simulasi pembuatan wallet: generate dummy address & private key
        $address = "0x" . substr(md5(uniqid()), 0, 40);
        $privateKey = "0x" . substr(md5(uniqid()), 0, 64);
        // Untuk demo, simpan tanpa enkripsi. Di produksi, enkripsi privateKey!
        $_SESSION['wallets'][$uid] = [
            "address" => $address,
            "encryptedPrivateKey" => $privateKey
        ];
        sendResponse(["address" => $address, "message" => "Wallet berhasil dibuat"]);
        break;

    case "getWallet":
        $uid = isset($data['uid']) ? $data['uid'] : '';
        if (!$uid) {
            sendResponse(["error" => "UID tidak diberikan"], 400);
        }
        if (isset($_SESSION['wallets'][$uid])) {
            sendResponse([
                "walletExists" => true,
                "address" => $_SESSION['wallets'][$uid]['address']
            ]);
        } else {
            sendResponse(["walletExists" => false]);
        }
        break;

    case "signMetaTx":
        // Simulasi penandatanganan meta-transaction: kembalikan dummy signature
        sendResponse(["signature" => "0xSimulatedSignature"]);
        break;

    case "forwardTx":
        // Simulasi forward transaksi ke blockchain: kembalikan pesan sukses
        sendResponse(["message" => "Transaksi (voting) berhasil dikirim!"]);
        break;
        
    case "createPoll":
        // Simulasi pembuatan poll
        // Di sini seharusnya backend mengirim transaksi ke smart contract.
        // Untuk demo, cukup kembalikan pesan sukses.
        sendResponse(["message" => "Poll berhasil dibuat (simulasi)"]);
        break;
        
    case "getWinner":
        // Simulasi pengambilan hasil voting. Misalnya, kembalikan pemenang dummy.
        sendResponse([
            "winnerName" => "Alice",
            "voteCount" => 123
        ]);
        break;
        
    default:
        sendResponse(["error" => "Endpoint tidak ditemukan"], 404);
        break;
}
?>
