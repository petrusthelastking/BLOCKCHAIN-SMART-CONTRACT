// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VariableTypes{
    //State variable
    uint sum;

    //Local variable 
    function tambah(uint num1, uint num2) public {
        //Local (penyimpanan bersifat sementara)
        uint temp = num1 + num2;

        sum = temp;
    }

    function getHasil()public view returns(uint){
        return sum;
    } 
}

contract Type{
    bool public valid = true;

    int32 public angkaku = -32; //int boleh minus angka nya
    uint public  angkamu = 1; // uint tidak boleh ada minus pada angka nya

    uint32 public ui_data = 5_01_2021;

    // ini sivat nya state
    uint8 result;

    function tambah()public {
        // solusi agar bisa float(result = 3/5) di uint
        result = 3.5 + 1.5;

    }

    //bytes 1-32 = sering digunakan untuk menhimpun yang sifat karakter nya tetap
    //bytes juga menghemat gas kalau nilai nya sudah fix cukup memakai bytes

    bytes1 public huruf = "A";
    string public  kalimat = "ini adalah data String";

    

}

// enum adalah local variable
contract Enumsaya{
    enum jobs {Progremer, Analisis, Security}

    function getEnum() public pure  returns (jobs){
        return jobs.Analisis;
    }
}