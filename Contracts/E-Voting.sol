// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EVoting {
    // Struktur kandidat
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Daftar kandidat
    Candidate[] public candidates;

    // Mapping untuk melacak apakah pemilih telah memberikan suara
    mapping(address => bool) public hasVoted;

    // Alamat admin
    address public admin;

    // Status pemilu
    bool public electionActive;

    // Event untuk mencatat aktivitas
    event ElectionStarted();
    event ElectionEnded();
    event Voted(address indexed voter, uint indexed candidateIndex);

    // Modifier untuk membatasi akses hanya untuk admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat melakukan ini");
        _;
    }

    // Modifier untuk memastikan pemilu sedang berlangsung
    modifier whenElectionActive() {
        require(electionActive, "Pemilu belum dimulai atau sudah selesai");
        _;
    }

    constructor() {
        // Set admin sebagai deployer kontrak
        admin = msg.sender;

        // Tambahkan kandidat
        candidates.push(Candidate("Rudi", 0));
        candidates.push(Candidate("Nina", 0));
    }

    // Fungsi untuk memulai pemilu
    function startElection() external onlyAdmin {
        require(!electionActive, "Pemilu sudah dimulai");
        electionActive = true;
        emit ElectionStarted();
    }

    // Fungsi untuk mengakhiri pemilu
    function endElection() external onlyAdmin {
        require(electionActive, "Pemilu belum dimulai");
        electionActive = false;
        emit ElectionEnded();
    }

    // Fungsi untuk memberikan suara
    function vote(uint candidateIndex) external whenElectionActive {
        require(!hasVoted[msg.sender], "Anda sudah memberikan suara");
        require(candidateIndex < candidates.length, "Kandidat tidak valid");

        // Rekam suara
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;

        emit Voted(msg.sender, candidateIndex);
    }

    // Fungsi untuk mendapatkan total suara dari kandidat
    function getCandidateVotes(uint candidateIndex) external view returns (uint) {
        require(candidateIndex < candidates.length, "Kandidat tidak valid");
        return candidates[candidateIndex].voteCount;
    }

    // Fungsi untuk mendapatkan nama kandidat
    function getCandidateName(uint candidateIndex) external view returns (string memory) {
        require(candidateIndex < candidates.length, "Kandidat tidak valid");
        return candidates[candidateIndex].name;
    }

    // Fungsi untuk mendapatkan total kandidat
    function getTotalCandidates() external view returns (uint) {
        return candidates.length;
    }

    // Fungsi untuk menentukan pemenang
    function getWinner() external view returns (string memory) {
    require(!electionActive, "Pemilu masih berlangsung. Selesaikan pemilu terlebih dahulu.");

    if (candidates[0].voteCount > candidates[1].voteCount) {
        return candidates[0].name;
    } else if (candidates[1].voteCount > candidates[0].voteCount) {
        return candidates[1].name;
    } else {
        return "Hasil seri. Tidak ada pemenang.";
    }
}

}
