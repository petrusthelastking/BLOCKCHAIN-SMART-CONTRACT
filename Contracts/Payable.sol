// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

//payable
contract Payable {
    address payable public ownaer;

    constructor() payable {
        ownaer = payable(msg.sender);
    }

    function deposit() public payable{

    }

    //getAmount untuk melihat jumlah kontrak nya yang ada sudah ada saldo di smart contract
    function getAmount() public view returns (uint){
        uint amount = address(this).balance;

        return amount;
    }
    //witdraww adalah dana yang ada dismart contract itu akan di transfer kembali ke ownernya/ pemilik smart contractnya
    function witdraww() public {
        uint amount = address(this).balance;

        (bool succes,) = ownaer.call{value: amount}("");
        require(succes, "Failed kirim ether ke owner");
    }
    // transfer adalah dari smart contract dia mengirim ke address lain 
    function transfer(address payable _to, uint _amount) public {
        (bool succes,) = _to.call{value: _amount}("");
        require(succes, "Failed kirim ether ke owner");
    }
}