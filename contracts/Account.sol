pragma solidity ^0.5.0;

contract Account {
  mapping (address => AccountData) public account;

  struct AccountData {
    string accountPublicKey;
    string accountType;
    string accountName;
    string accountAddress;
    string accountPhoneNumber;
    string data;
  }

  function createAccount(address _address,
    string memory _accountPublicKey,
    string memory _accountType,
    string memory _accountName,
    string memory _accountAddress,
    string memory _accountPhoneNumber,
    string memory _data) public {

    account[_address] = AccountData(_accountPublicKey, _accountType, _accountName, _accountAddress, _accountPhoneNumber, _data);
  }
}