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
}

export default AccessRequestLedger