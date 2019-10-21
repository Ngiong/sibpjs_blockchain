import { encryptRSA, decryptRSA } from './rsa'

let drizzle = null
let drizzleState = null

const getAccountInfo = address => {
  const contract = drizzle.contracts.Account
  const _getAccountDataKey = contract.methods['accounts'].cacheCall(address)

  const accountData = drizzleState.contracts.Account.accounts[_getAccountDataKey]
  const value = accountData && accountData.value
  return value
}

class DocumentLedger {
  constructor (_drizzle, _drizzleState) {
    drizzle = _drizzle
    drizzleState = _drizzleState
  }

  // function createDocument(address _owner, string memory _data) public {
  //   totalDocument++;
  //   OwnedDocumentData memory _tmp = OwnedDocumentData(totalDocument, _data);
  //   ownedDocumentList[_owner].push(_tmp);
  // }

  createDocument = input => {
    const recipientAddress = input.documentRecipient
    const recipient = getAccountInfo(recipientAddress)
    const cipher = encryptRSA(recipient.publicKey, JSON.stringify(input))
    this.submitDocumentContract(recipientAddress, cipher)
  }

  submitDocumentContract = (owner, cipher) => {
    const contract = drizzle.contracts.Document
    const transactionStackId = contract.methods['createDocument'].cacheSend(owner, cipher)
    return transactionStackId
  }
}

export default DocumentLedger