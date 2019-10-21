import { encryptRSA, decryptRSA } from './rsa'

let drizzle = null
let drizzleState = null

class DocumentLedger {
  constructor (_drizzle, _drizzleState) {
    if (drizzle === null) drizzle = _drizzle
    if (drizzleState === null) drizzleState = _drizzleState
  }

  // function createDocument(address _owner, string memory _data) public {
  //   totalDocument++;
  //   OwnedDocumentData memory _tmp = OwnedDocumentData(totalDocument, _data);
  //   ownedDocumentList[_owner].push(_tmp);
  // }

  getDocumentRecipientAccountInfo = address => {
    const contract = drizzle.contracts.Account
    const _getAccountDataKey = contract.methods['accounts'].cacheCall(address)
    return _getAccountDataKey
  }

  createDocument = (recipient, input) => {
    const recipientAddress = input.documentRecipient
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