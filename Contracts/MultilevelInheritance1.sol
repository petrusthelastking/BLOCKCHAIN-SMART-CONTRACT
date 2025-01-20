// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

//Single Inheritance
contract orangtua{
    uint internal id;

    function setvalue(uint _value) external  {
        id = _value;
    }
}

contract andi is orangtua{
    function getvalue() external  view returns (uint){
        return id;
    }
}

contract caller{
    andi andika = new andi();

    function wariskan(uint _input) public returns (uint) 
{
    andika.setvalue(_input);
    return  andika.getvalue();
}
}