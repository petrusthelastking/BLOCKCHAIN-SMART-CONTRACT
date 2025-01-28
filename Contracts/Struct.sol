// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Structure{
    
    //structs

    struct buku{
        string judul;
        string author;
        uint id;
        bool isreaddy;
    }

    buku buku1;

    function tambahbuku() public{
        buku1 = buku("pemrograman blockchain", "Saya", 1, true);
    }

    function lihatbuku() public view returns (string memory, string memory, uint, bool){
        return (buku1.judul, buku1.author, buku1.id, buku1.isreaddy);
    } 

    //langsung dalam pembuatan buku tanpa (function tambah buku)
    buku buku2 = buku("membuat Daaps", "nina", 13, false);

    function lihatbuku2() public view returns (string memory, string memory){
        return (buku2.judul, buku2.author);
    }

    // memakai parameter dalam bentuk Array
    buku[] public buku3;

    function newbook(string memory judul, string memory author, uint id, bool isreaddy)public {
        buku3.push(buku(judul, author, id, isreaddy));
    }

    function infobuku(uint _index) public view returns (string memory judul, string memory author){
        buku storage book = buku3[_index];
        return (book.judul, book.author);
    }
}