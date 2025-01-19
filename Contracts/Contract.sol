// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Contoh{
    uint value;

    constructor() public  {
        value = 10;
    }

    function getvalue() public view returns (uint) {
        return value;
    }
}

// penggunaan constructor bisa digunakan banyak hal
// contoh: setting runtime sebuah nilai parameter misalnya ada pembatasa address tertentu
// misalnya jadi kala bukan address tersebut tentu kita tidak bisa melakukan delivers supply
// data token atau mengirim ether

contract tokensaya{
    int totalsSupply;

    address private owner = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;

    constructor(int _totalSupply) public {

        if(msg.sender == owner) {
            totalsSupply = _totalSupply;
        }
        
    }

    function gettotalsuppyl() public view returns (int){
        return  totalsSupply;
    }
}

