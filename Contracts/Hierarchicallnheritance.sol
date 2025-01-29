// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract A {
    function getAvalue() external pure returns (string memory){
        return "Contract A dipanggil";
    }
}

contract B is A {

}

contract C is A{

}

contract caller{
    B contractB = new B();
    C contractC = new C();

    function warisa() public view  returns (string memory, string memory){
        return (contractB.getAvalue(), contractC.getAvalue());
    }
}