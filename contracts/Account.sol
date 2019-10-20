pragma solidity ^0.5.0;

contract Account {
  mapping (address => AccountData) public accounts;

  struct AccountData {
    string publicKey;
    string accountType;
    string data;
  }

  function createAccount(address _address,
    string memory _publicKey,
    string memory _accountType,
    string memory _data) public {

    accounts[_address] = AccountData(_publicKey, _accountType, _data);
  }

  constructor() public {
    createAccount(0x1898C85C2Ad7F3Ba1073a6Ca5a3323Ea6cDEFFf6, 'myPublicKey', 'REGULAR', '{"name": "regular-1", "bpjs": "myBPJS-1"}');
    createAccount(0x9f448C0d30089C7a87D55e0A10BFFbD1B4deF927, 'myPublicKey-2', 'HEALTH_PROVIDER', '{"name": "hospital-1"}');
  }
}