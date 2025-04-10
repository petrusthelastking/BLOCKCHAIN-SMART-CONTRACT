<?php
// api.php
header('Content-Type: application/json');

// Dapatkan parameter endpoint dari query string
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

$data = json_decode(file_get_contents("php://input"), true);

function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Untuk demo, kita simpan data wallet di session (di production, gunakan database)
session_start();
if (!isset($_SESSION['wallets'])) {
    $_SESSION['wallets'] = [];
}

switch ($endpoint) {
    case "createWallet":
        $uid = isset($data['uid']) ? $data['uid'] : '';
        if (!$uid) {
            sendResponse(["error" => "UID tidak diberikan"], 400);
        }
        if (isset($_SESSION['wallets'][$uid])) {
            sendResponse(["address" => $_SESSION['wallets'][$uid]['address'], "message" => "Wallet sudah ada"]);
        }
        // Simulasi pembuatan wallet (generate dummy address & private key)
        $address = "0x" . substr(md5(uniqid()), 0, 40);
        $privateKey = "0x" . substr(md5(uniqid()), 0, 64);
        // Untuk demo, simpan private key tanpa enkripsi (di production, enkripsi terlebih dahulu)
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
            sendResponse(["walletExists" => true, "address" => $_SESSION['wallets'][$uid]['address']]);
        } else {
            sendResponse(["walletExists" => false]);
        }
        break;
    case "signMetaTx":
        // Simulasi tanda tangan meta-transaction (di production, gunakan private key user untuk tanda tangan)
        $dummySignature = "0xSimulatedSignature";
        sendResponse(["signature" => $dummySignature]);
        break;
    case "forwardTx":
        // Simulasi forward transaksi ke blockchain
        sendResponse(["message" => "Voting berhasil dikirim!"]);
        break;
    default:
        sendResponse(["error" => "Endpoint tidak ditemukan"], 404);
        break;
}
