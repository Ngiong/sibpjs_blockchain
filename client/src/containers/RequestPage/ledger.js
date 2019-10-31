import { encryptRSA } from './rsa'

let drizzle = null
let drizzleState = null

class AccessRequestLedger {
  constructor (_drizzle, _drizzleState) {
    if (drizzle === null) drizzle = _drizzle
    if (drizzleState === null) drizzleState = _drizzleState
  }

  createAccessRequest = (requester, requestTo) => {
    const contract = drizzle.contracts.AccessRequest
    const transactionStackId = contract.methods['createAccessRequest'].cacheSend(requester, requestTo)
    return transactionStackId
  }

  getAccessRequestByGranterList = address => {
    const contract = drizzle.contracts.AccessRequest
    const _getAccessRequestList = contract.methods['getAccessRequestByGranterList'].cacheCall(address)
    return _getAccessRequestList
  }

  getAccessRequestByRequesterList = (address, take) => {
    const contract = drizzle.contracts.AccessRequest
    const _getAccessRequestList = contract.methods['getAccessRequestByRequesterList'].cacheCall(address, take)
    return _getAccessRequestList
  }

  getAccessRequestById = requestId => {
    const contract = drizzle.contracts.AccessRequest
    const _getAccessRequestDataKey = contract.methods['accessRequest'].cacheCall(requestId)
    return _getAccessRequestDataKey
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

  getAccountInfo = address => {
    const contract = drizzle.contracts.Account
    const _getAccountDataKey = contract.methods['account'].cacheCall(address)
    return _getAccountDataKey
  }

  authorizeDocument = (requestId, requesterAddress, cipher, requestStatus) => {
    const contract = drizzle.contracts.Document
    const arContract = drizzle.contracts.AccessRequest.address
    const granterAccountAddress = drizzleState.accounts[0]
    const txStackId = contract.methods['authorizeDocument'].cacheSend(arContract, requestId, 
      requestStatus, requesterAddress, granterAccountAddress, cipher)
    return txStackId
  }
}

export default AccessRequestLedger