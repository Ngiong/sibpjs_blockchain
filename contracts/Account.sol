pragma solidity ^0.5.0;

contract Account {
  mapping (address => AccountData) public account;

  struct AccountData {
    string publicKey;
    string accountType;
    string data;
  }

  function createAccount(address _address,
    string memory _publicKey,
    string memory _accountType,
    string memory _data) public {

    account[_address] = AccountData(_publicKey, _accountType, _data);
  }
}