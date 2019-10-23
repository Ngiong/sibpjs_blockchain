import { encryptRSA, decryptRSA } from './rsa'

let drizzle = null
let drizzleState = null

class DocumentLedger {
  constructor (_drizzle, _drizzleState) {
    if (drizzle === null) drizzle = _drizzle
    if (drizzleState === null) drizzleState = _drizzleState
  }

  getDocumentRecipientAccountInfo = address => {
    const contract = drizzle.contracts.Account
    const _getAccountDataKey = contract.methods['account'].cacheCall(address)
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

  getOwnedDocumentList = address => {
    const contract = drizzle.contracts.Document
    const _getOwnedDocumentListDataKey = contract.methods['getOwnedDocumentList'].cacheCall(address)
    return _getOwnedDocumentListDataKey
  }
}

export default DocumentLedger