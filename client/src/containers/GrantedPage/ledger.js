import { encryptRSA } from './rsa'

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
    const documentData = { ...input }
    delete documentData.accountPrivateKey
    const cipher = encryptRSA(recipient.accountPublicKey, JSON.stringify(documentData))

    const issuerAddress = drizzleState.accounts[0]
    this.submitDocumentContract(recipientAddress, issuerAddress, input.documentType, cipher, '_signature')
  }

  submitDocumentContract = (owner, issuer, documentType, cipher, signature) => {
    const contract = drizzle.contracts.Document
    const transactionStackId = contract.methods['createDocument'].cacheSend(owner, issuer, documentType, cipher, signature)
    return transactionStackId
  }

  getOwnedDocumentList = address => {
    const contract = drizzle.contracts.Document
    const _getOwnedDocumentListDataKey = contract.methods['getOwnedDocumentList'].cacheCall(address)
    return _getOwnedDocumentListDataKey
  }

  getDocumentById = documentId => {
    const contract = drizzle.contracts.Document
    const _getDocumentByIdDataKey = contract.methods['ownedDocumentData'].cacheCall(documentId)
    return _getDocumentByIdDataKey
  }

  getAuthorizedDocumentById = documentId => {
    const contract = drizzle.contracts.Document
    const _getDocumentByIdDataKey = contract.methods['authorizedDocumentData'].cacheCall(documentId)
    return _getDocumentByIdDataKey
  }
}

export default DocumentLedger