pragma solidity ^0.5.0;

contract Account {
  mapping (address => AccountData) public account;

  struct AccountData {
    string accountPublicKey;
    string accountType;
    string accountName;
    string accountPhoneNumber;
    string data;
  }

  function createAccount(address _address,
    string memory _accountPublicKey,
    string memory _accountType,
    string memory _accountName,
    string memory _accountPhoneNumber,
    string memory _data) public {

    account[_address] = AccountData(_accountPublicKey, _accountType, _accountName, _accountPhoneNumber, _data);
  }
}