let drizzle = null
let drizzleState = null

class AccountLedger {
  constructor (_drizzle, _drizzleState) {
    drizzle = _drizzle
    drizzleState = _drizzleState
  }

  createAccount = input => {
    const contract = drizzle.contracts.Account
    const accountAddress = drizzleState.accounts[0]

    const publicKey = input.publicKey
    const accountType = input.accountType
    const data = {
      ...input.accountProperties,
      accountName: input.accountName,
    }

    const transactionStackId = contract.methods['createAccount'].cacheSend(accountAddress, publicKey, accountType, JSON.stringify(data))
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