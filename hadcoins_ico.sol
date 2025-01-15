// Hadcoin ICO

// Version of compiler
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;

contract hadcoins_ico {
    // mempekernalan tentang maksimum angka dari Hadcoin yang tersedia untuk dijual
    uint public max_hadcoins = 1000000;

    // memperkenalkan pertukaran nilai antara USD dan Hadcoins 
    uint public usd_to_hadcoins = 1000;

    // memeprkenalkan total dari jumlah hadcoins yang telah dibeli oleh investor
    uint public  total_hadcoins_bought = 0;

    // mapping dari alamat investor kepada equity kedalam hadcoins dan USD
    mapping(address => uint) equity_hadcoins;
    mapping(address => uint) equity_usd;

    // memeriksa apakah investor dapat membeli Hadcoins
    modifier can_buy_hadcoins(uint usd_invested) {
        require(usd_invested * usd_to_hadcoins + total_hadcoins_bought <= max_hadcoins);
        _;
    }

    // Mendapatkan ekuitas dalam hadcoin dari seorang investor
    function equity_in_hadcoins(address investor) external constant returns (uint){
        return equity_hadcoins[investor];
    }

    // Mendapatkan ekuitas dalam USD dari seorang investor
    function equity_in_usd(address investor) external constant returns (uint){
        return equity_usd[investor];
    }

    // membeli hadcoins
    function buy_hadcoins(address investor, uint usd_invested) external
    can_buy_hadcoins(usd_invested) {
        uint hadcoins_bought = usd_invested * usd_to_hadcoins;
        equity_hadcoins[investor] += hadcoins_bought;
        equity_usd[investor] = equity_hadcoins[investor] / 1000;
        total_hadcoins_bought += hadcoins_bought;
    } 

    // menjual Hadcoins
     function sel_hadcoins(address investor, uint hadcoins_sold) external {
        equity_hadcoins[investor] -= hadcoins_sold;
        equity_usd[investor] = equity_hadcoins[investor] / 1000;
        total_hadcoins_bought -= hadcoins_sold;
    } 
}