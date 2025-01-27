// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

abstract contract Abstrak {
    function getangka(uint a, uint b) public virtual;

    function hitung() public virtual view returns(uint);
}

contract Hitung is Abstrak {

    uint panjang;
    uint lebar;

    function getangka(uint a, uint b) public override {
        panjang = a;
        lebar = b;
    }

    function hitung() public override view returns (uint) {
        return panjang * lebar;
    }
}
