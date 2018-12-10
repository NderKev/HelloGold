pragma solidity ^0.4.23;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./RefundVault.sol";

contract HelloGold is Ownable{
  using SafeMath for uint256;

  RefundVault public vault;
  address[] public investors;

  mapping (address => uint256) public investedAmount;
  mapping(address => bool) public accounts;

modifier investorList(address _investor) {
    require(accounts[_investor]);
    _;
  }
constructor (address _vaultAddress) public{
  require(_vaultAddress != address(0));
  vault = new RefundVault(_vaultAddress);
}

function depositFunds (address _investor, uint256 _weiAmount) public payable{
  _investor = msg.sender;
  require(_investor != address(0));
  _weiAmount = msg.value;
  //require(msg.value > 0);
  accounts[msg.sender]= true;
  _forwardFunds(_weiAmount);
  investedAmount[msg.sender] = _weiAmount;

}

/**
 * @dev fallback function ***DO NOT OVERRIDE***
 */
function () external payable {
  depositFunds(msg.sender, msg.value);
}




function investorsCount() public constant returns (uint) {
    return investors.length;
  }

  function checkBalance() public investorList(msg.sender) returns (uint256) {
    //require(investedAmount[msg.sender] > 0);
    uint256 balance = investedAmount[msg.sender];
    return balance;
  }

  function claimRefund() public investorList(msg.sender){
    require(investedAmount[msg.sender] > 0);
    vault.enableRefunds();
    vault.refund(msg.sender);
  }

  function _forwardFunds(uint256 _value) internal {
    vault.deposit.value(_value)(msg.sender);
    if (investedAmount[msg.sender] == 0){
      investedAmount[msg.sender] = _value;
      investors.push(msg.sender);
    }
    else {
      investedAmount[msg.sender] = investedAmount[msg.sender].add(_value);
      investors.push(msg.sender);
    }
  }


}
