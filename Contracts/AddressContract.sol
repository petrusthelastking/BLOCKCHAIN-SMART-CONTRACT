// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract addressContract{
    //address = nomor rekening
    //smart contract punya addres

    //address payable
    //sen dan transfer

    //address public caller;

    //function getCallerAddress() public returns(address){
        //caller = msg.sender;

        //return caller;
    //}

    // ini untuk melihat address dari msg.sender/ aku yang di deploy ke smart contract
    // function getCallerAddress() public view  returns (address caller){
        // caller = msg.sender;
    // }

    uint receivedAmount;

    // untuk mencari tahu alamat address dari smart contract
    function getaddress() public  view  returns (address){
        address myaddress = address(this);
        return myaddress;
    }

    function receiveEther() payable  public {
        receivedAmount = msg.value;
    }

    //address payable
    function tarnsferFund(address payable _address, uint nominal) public {
        _address.transfer(nominal);
    }

    function sendFund(address payable _address, uint nominal) public returns(bool){
        _address.send(nominal);
    }
}