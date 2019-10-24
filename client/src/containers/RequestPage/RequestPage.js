import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import AccessRequestLedger from './ledger'

const FIELD = {
  REQUEST_TO: 'requestTo',
  VIEW_REQUEST_ID: 'viewRequestId',
}

class RequestPage extends ReactDrizzleComponent {
  state = {
    input: {
      requestTo: '',
      viewRequestId: 0,
    },
    _getAccessRequestListDataKey: null,
    _getAccessRequestDataKey: {},
    _transactionStackId: null,
  }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getAccessRequestListDataKey', 'AccessRequest', 'getAccessRequestList', this.retrieveAccessRequests)
  }

  componentDidMount = () => {
    const _getAccessRequestListDataKey = this.retrieveAccessRequestList()
    this._drizzleStateIfExist(_getAccessRequestListDataKey, 'AccessRequest', 'getAccessRequestList', this.retrieveAccessRequests)
    this.setState({ _getAccessRequestListDataKey })
  }

  render = () => {
    const { input } = this.state

    const createRequestSection = <div>
      <h2>Create Request Section</h2>

      <div>Request To: </div>
      <div><input type='text' value={input.requestTo} onChange={this.handleInputChange.bind(this, FIELD.REQUEST_TO)} /></div>

      <div onClick={this.handleCreateRequestSubmission}>Submit</div>
    </div>

    const accessRequests = this.readAccessRequests()
    const rAccessRequests = this.renderAccessRequests(accessRequests, this.handleSelectAccessRequest)

    const requestListSection = <div>
      <h2>Request List Section</h2>
      {rAccessRequests}
    </div>

    const documentSelectionSection = <div>
      <h2>Document Selection Section</h2>
      <div>Selecting requestId: {this.state.input.viewRequestId}</div>
    </div>

    return <div>
      <h1>Access Request Page</h1>
      {createRequestSection}
      {requestListSection}
      {documentSelectionSection}
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = event.target.value
    this.setState({ input: newInput })
  }

  handleSelectAccessRequest = requestId => {
    let newInput = { ...this.state.input }
    newInput.viewRequestId = requestId
    this.setState({ input: newInput })
  }

  handleCreateRequestSubmission = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const accountAddress = drizzleState.accounts[0]
    const _transactionStackId = ledger.createAccessRequest(accountAddress, this.state.input.requestTo)
    this.setState({ _transactionStackId })
  }

  retrieveAccessRequestList = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const accountAddress = drizzleState.accounts[0]
    return ledger.getAccessRequestList(accountAddress)
  }

  readAccessRequestList = () => {
    let { _getAccessRequestListDataKey } = this.state
    const accessRequestList = this.props.drizzleState.contracts.AccessRequest.getAccessRequestList[_getAccessRequestListDataKey]
    const value = accessRequestList && accessRequestList.value
    return value
  }

  retrieveAccessRequests = accessRequestIds => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)

    let _getAccessRequestDataKey = {}
    accessRequestIds
      .filter(s => s > 0)
      .forEach(accessRequestId => {
        const _dataKey = ledger.getAccessRequestById(accessRequestId)
        _getAccessRequestDataKey[accessRequestId] = _dataKey
      })
    this.setState({ _getAccessRequestDataKey })
  }

  readAccessRequests = () => {
    const { _getAccessRequestDataKey } = this.state

    let accessRequestResult = {}
    Object.keys(_getAccessRequestDataKey).forEach(requestId => {
      const result = this.props.drizzleState.contracts.AccessRequest.accessRequest[_getAccessRequestDataKey[requestId]]
      const data = result && result.value
      accessRequestResult[requestId] = data
    })
    return accessRequestResult
  }

  renderAccessRequests = (accessRequestList, onSelect) => {
    return Object.keys(accessRequestList).map(requestId => {
      const data = accessRequestList[requestId]
      if (!data) return null
      return <div key={'access-request-id-' + requestId}>
        <span>{data.id + ' : '}</span>
        <span>{'Completed:' + data.completed + ', '}</span>
        <span>{data.requester + '  ->  '}</span>
        <span onClick={() => onSelect(requestId)}>SELECT</span>
      </div>
    })
  }
}

export default RequestPage