pragma solidity ^0.5.0;

contract Account {
  mapping (address => AccountData) public accounts;

  struct AccountData {
    string bpjsAccountNumber;
    string publicKey;
  }

  function createAccount(address _address,
    string memory _bpjsAccountNumber,
    string memory _publicKey) public {

    accounts[_address] = AccountData(_bpjsAccountNumber, _publicKey);
  }

  constructor() public {
    createAccount(0x1898C85C2Ad7F3Ba1073a6Ca5a3323Ea6cDEFFf6, 'myBPJS', 'myPublicKey');
    createAccount(0x9f448C0d30089C7a87D55e0A10BFFbD1B4deF927, 'myBPJS-2', 'myPublicKey-2');
  }
}