// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract ProofOfExistence{

    mapping (bytes32 => bool) private proofs;
    // store a proof a existence in the contract state
    function storageProof(bytes32 proof) private {
        proofs[proof] = true;
    }
    // calculate and store the proof for a document
    function notaris(string memory document) public {
        storageProof(proofFor(document));
    }
    // helper function to get a document's sha256
    function proofFor(string memory document) private pure returns (bytes32){
        return sha256(bytes(document));
    }
    // check if a document has been notarized
    function chekDocument(string memory document) public view returns (bool){
        return proofs[proofFor(document)];
    }
}