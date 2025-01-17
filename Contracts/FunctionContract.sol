pragma solidity ^0.8.0;

contract HelloWorld{
    // state variable
    uint hasil;

    // kalau kita memakai pure hanya mengembalikan nilai satu aja
    // kalau tanpa pure kita bisa mengembalikan nilai untuk memodifikasi dari state variable
    function cektakhello() public pure returns (string memory){
        return 'Hello world';
    }

    function  tambah(uint a, uint b) public {
        // local
        uint temp = a + b;

        hasil = temp;
    }

    // mencetak hasil nya

    function getHasil() public  view  returns(uint){
        return hasil;
    }
}


// Payable memungkin kan kita smart contract kita menerima dana ETH dari salah satu
// akun
// contoh: akun tersebut transfer ether ke smart contract kita jadi kira harus menambahkan Payable

contract PayableContract{
    
    uint receivedAmount;

    // menerima ETH
    function receivedEther() payable  public {
        receivedAmount = msg.value; // msg.value ini dari nilai yang dikirimkan oleh akun cuman untuk contart ini value dalam bentuk wey
    }

    function getTotalAmount() public view  returns (uint){
        return receivedAmount;
    }

    //Overload: kita bisa memiliki fungsi yang nama nya sama namun ketika dijalan kan maka parameternya harus berbeda
    // nama nya boleh sama tetapi parameter nya harus sama

    function tambah(uint a, uint b) public  pure  returns (uint hasil){
        hasil = a + b;
    }

    function tambah(uint a, uint b, uint c) public  pure  returns (uint hasil){
        hasil = a + b + c;
    }
}
