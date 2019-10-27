let drizzle = null
let drizzleState = null

class AccountLedger {
  constructor (_drizzle, _drizzleState) {
    if (drizzle === null) drizzle = _drizzle
    if (drizzleState === null) drizzleState = _drizzleState
  }

  // function createAccount(address _address,
  //   string memory _accountPublicKey,
  //   string memory _accountType,
  //   string memory _accountName,
  //   string memory _accountPhoneNumber,
  //   string memory _data) public {

  //   account[_address] = AccountData(_accountPublicKey, _accountType, _accountName, _accountPhoneNumber, _data);
  // }

  createAccount = input => {
    const contract = drizzle.contracts.Account
    const accountAddress = drizzleState.accounts[0]

    let storedFieldForData = []
    if (input.accountType === 'REGULAR')
      storedFieldForData = ['accountBPJS', 'accountBirthdate', 'accountGender']
    else
      storedFieldForData = ['accountLicenseNumber', 'accountLicenseValidity',
      'accountPICName', 'accountPICNPWP', 'accountPICRole', 'accounPICPhoneNumber']

    const data = storedFieldForData
      .reduce((dict, item) => { dict[item] = input[item]; return dict }, {})

    const transactionStackId = contract.methods['createAccount'].cacheSend(
      accountAddress,
      input.accountPublicKey,
      input.accountType,
      input.accountName,
      input.accountAddress,
      input.accountPhoneNumber,
      JSON.stringify(data))
    return transactionStackId
  }

  getTransactionStatus = stackId => {
    const { transactions, transactionStack } = drizzleState
    const txHash = transactionStack[stackId];

    if (!txHash) return null
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
  }
}

export default AccountLedger