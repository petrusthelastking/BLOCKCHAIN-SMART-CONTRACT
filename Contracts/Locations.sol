// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Lokasi data
//gas 

//Storage: lokasi yang penyimpanannya bersifat permanen
//Memory: memori gas nya murah tetapi memori haya bisa di akses dalam fungsi itu saja (sementara)
//calldata: lokasi ini tidak bisa dimonifikasi lalu sifat nya persistent / nilai nya tetap lokasi dan juga calldata itu lokasi defalut parameternya
//stack: data yang sifatnya non persisten sama karakternya mirip yang dikelola langsung oleh Virtual mesinnya Etherium
//Fmnya ini menggunakan lokasi data tersebut untuk tetap step tersebut untuk membuat variable selama adanya eksekusi 
//lokasi ini dari stack ini sampai 1024 level aja

contract DataLocations{
    //Storage
    uint stateStorage;
    
    //uint storage stateStoragesaya; //ERROR

    //ini akan tersimpan dimemorry
    function kalkulasi(uint a, uint b) public pure  returns (uint hash){
        return a + b;
    }
}

//Poin poin penting:
//jika lokasi berada di luar function berabrti akan terseimpan di storage
//jika didalam function bebarti akan tersimpan di memory
//kalau diluar function penggunaan gas nya akan mahall
//kalau didalam function penggunaan gas nya akan lebih murah
contract Locations1{
    //storage
    bool isReady;

    function iniFungsi() public {
        //values yang yang tersimpan di Local
        bool isOke;
        uint number;
        address akun;
    }
}

//parameter function tidak termasuk parameter retruns dari fungsi eksternal tersimpan di calldata
//memang ada prilaku data itu bisa disalin dari satu variable ke variable lain ada dengan dua cara
//sala satu caranya dengan mengcopy seluruh data copy B Velues
//dan cara kedua copy by franz

contract locations2 {
    uint public statevaiable1 = 10; // state variable
    uint statevariable2 = 20; // state variable

    function inifungsi() public returns (uint){
        statevaiable1 = statevariable2;
        statevariable2 = 30;

        return statevaiable1; //balikan nya 20
    }
}

//hal yang sama berlaku untuk variable yang tipenya reverse yang pakai Arry jadi penetapan varable state
//di storage ini dari memory lalu membuat saa-6 baru


contract Locations3 {
    uint statevar = 10;

    function iniFungsi() public returns (uint){
        uint localvar = 20; // tersimpan di memory sifat nya local
        statevar = localvar;
        localvar = 40; // tidak bisa mengubah

        return statevar;// mengembalikan nilai 20
    }
}

// penugasan ke variable memory dari variable state yanga da di storage akan membuat salinan baru


contract Location{
    // uint statevar =10; // tersimapn di storage

    // function inifungsi()public returns (uint){
    //     uint lokalvar = 20// tersimpan di memory

    //     lokalvar = statevar;
    //     statevar = 40; // tidak berpengaruh

    //     return lokalvar;
    // }

    // contoh penetapan penyaliann ini menjadi salinan baru 
    // ketika kita menggunakan value style kita tidak mendefinisikan secara eksplisit memory
    // tetapi untuk bertipe array atau reverse tipe kita harus menambahkan memory sebelum nama variablenya
    function inifungsi() public pure returns (uint[] memory, uint[] memory){
        uint[] memory localMemoryarray1 = new uint[](3);

        localMemoryarray1[0] = 4;
        localMemoryarray1[1] = 5;
        localMemoryarray1[2] = 6;
        

        uint[] memory localMemoryarray2 = localMemoryarray1;
        localMemoryarray1[0] = 10;

        return (localMemoryarray1, localMemoryarray2);
    }

    // untuk tipe value itu bisa 
    // tapi untuk reverse state itu tidak bisa menyalin tidak bisa dibuat dua

    function inivalue() public returns (uint) {
        uint localvar1 = 10;
        uint localvar2 = 20;

        localvar1 = localvar2;
        localvar1 = 40;

        return localvar1;
    }

}