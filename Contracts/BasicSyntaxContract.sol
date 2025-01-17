// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicSyntaxContract{
    uint storedData;

    // Melakukan set data
    function set(uint x) public {
        storedData = x;
    }

    // menampilkan Data
    function get() public  view  returns  (uint){
        return  storedData;
    }
}