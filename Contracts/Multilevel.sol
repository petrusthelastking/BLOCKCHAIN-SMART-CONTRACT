// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract A{
    uint internal  a;

    function getA(uint _value) external {
        a = _value;
    }
}


contract B{
    uint internal b;
    
     function getB(uint _value) external {
        b = _value;
    }
}


contract C is A,B{
    function getvalueOFSum() external view returns (uint){
       return  a + b;
    }
}

contract caller{
    C contractC = new C();

    function warisan() public returns (uint){
        contractC.getA(10);
        contractC.getB(20);

        return contractC.getvalueOFSum();
    }
}