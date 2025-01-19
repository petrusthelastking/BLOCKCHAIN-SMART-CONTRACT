// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

//Arti Array kelompok variable dengan tipe yang sama dimana setiap variable memiliki lokasi
//tertentu yang disebut dengan index dan inde index itu bisa kita gunakan mengakses salah satu data nya 
//contoh: indek ke 0 index ke 1 index ke 2
//Array sendiri dibagi manjadi dua yaitu array yang sifatnya fixed 
contract ArrayContracts{
    //Array
    uint[5] data; // data tersimpan di state varible
    //fixed Array
    function getData() public returns (uint){
        data = [uint(50),60,70,80,100];
        return data[1];
    }

}


contract DynamisArray{
    uint[] data;

    uint[] databaru;

    function getdatabaru() public returns (uint[] memory){
        data = [60, 70, 80, 90, 100]; //inline
        return  data;
    }

    function getbaru() public returns(uint[] memory){
        databaru = new uint[](3);
        databaru[0] = 10;
        databaru[1] = 20;
        databaru[2] = 30;

        return (databaru);
    }

}

// menampilkan panjang dari suatu Array

contract ArrayLength{
    uint[7] data;

    function Arry_example() public  payable  returns (uint[7] memory){
        data = [uint(10), 20, 30, 40, 50, 60];
        return data;
    }

    function array_lenght() public returns(uint){
        uint x = data.length;
        return x;
    }
}


contract pushArray{
    uint [] arr;

    function insert() public returns (uint[] memory){
        arr = [1,2,3];
         
        //pushAaaray
        arr.push(4);
        arr.push(5);
        return arr;
    }
}


contract popaaray{
    uint [] arr;

    function hapusstu()public returns (uint[] memory){
        arr = [1,2,3];
        arr.pop();

        return arr;
    }

}

