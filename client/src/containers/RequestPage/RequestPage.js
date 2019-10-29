import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import AccessRequestLedger from './ledger'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

import './styles.css'

import accountIcon from './assets/account-icon.png'
import accountIconWhite from './assets/account-icon-white.png'

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
    _getAccessRequestByGranterListDataKey: null,
    _getAccessRequestByGranterDataKey: {},
    _getAccessRequestByRequesterListDataKey: null,
    _getAccessRequestByRequesterDataKey: {},
    _transactionStackId: null,
  }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getAccessRequestByGranterListDataKey', 'AccessRequest', 'getAccessRequestByGranterList', this.retrieveAccessRequestsByGranter)
    this._drizzleStateDidUpdate(prevProps, '_getAccessRequestByRequesterListDataKey', 'AccessRequest', 'getAccessRequestByRequesterList', this.retrieveAccessRequestsByRequester)
  }

  componentDidMount = () => {
    const _getAccessRequestByGranterListDataKey = this.retrieveAccessRequestByGranterList()
    this._drizzleStateIfExist(_getAccessRequestByGranterListDataKey, 'AccessRequest', 'getAccessRequestByGranterList', this.retrieveAccessRequestsByGranter)
    this.setState({ _getAccessRequestByGranterListDataKey })

    const _getAccessRequestByRequesterListDataKey = this.retrieveAccessRequestByRequesterList()
    this._drizzleStateIfExist(_getAccessRequestByRequesterListDataKey, 'AccessRequest', 'getAccessRequestByRequesterList', this.retrieveAccessRequestsByRequester)
    this.setState({ _getAccessRequestByRequesterListDataKey })
  }

  render = () => {
    const { input } = this.state

    const createRequestSection = <div>
      <h1>Pembuatan Permohonan Akses</h1>
      <div>Ajukan permohonan dokumen kepada pengguna lain pada halaman ini.</div>

      {TextField('Tujuan Permohonan', input.requestTo, this.handleInputChange.bind(this, FIELD.REQUEST_TO))}
      <div style={{ height: '1em' }} />
      {Button('Kirim', this.handleCreateRequestSubmission, 'secondary', 'large', false, 'outlined')}

    </div>

    const accessRequestsByRequester = this.readAccessRequestsByRequester()
    const rAccessRequestsByRequester = this.renderAccessRequestsByRequester(accessRequestsByRequester)

    const sentRequestListSection = <div style={{ marginTop: '3em' }}>
      <h3>Beberapa pengajuan akses yang pernah Anda buat:</h3>
      {rAccessRequestsByRequester}
    </div>

    const accessRequestsByGranter = this.readAccessRequestsByGranter()
    const rAccessRequestsByGranter = this.renderAccessRequestsByGranter(accessRequestsByGranter, this.handleSelectAccessRequest)

    const receivedRequestListSection = <div>
      <h1>Permintaan Akses Anda</h1>
      <div>SiBPJS <span style={{ color: '#dc3545', fontWeight: 700 }}>tidak bertanggung jawab</span> jika terdapat kebocoran informasi akibat kelalaian pengguna.</div>
      <div style={{ height: '2em' }} />
      {rAccessRequestsByGranter}
    </div>

    const documentSelectionSection = <div>
      <h1>Document Selection Section</h1>
      <div>Selecting requestId: {this.state.input.viewRequestId}</div>
    </div>

    return <div>
      {createRequestSection}
      {sentRequestListSection}
      {receivedRequestListSection}
      {documentSelectionSection}
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = typeof(event) === 'string' ? event : event.target.value
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

  retrieveAccessRequestByGranterList = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const accountAddress = drizzleState.accounts[0]
    return ledger.getAccessRequestByGranterList(accountAddress)
  }

  readAccessRequestByGranterList = () => {
    let { _getAccessRequestByGranterListDataKey } = this.state
    const accessRequestList = this.props.drizzleState.contracts.AccessRequest.getAccessRequestByGranterList[_getAccessRequestByGranterListDataKey]
    const value = accessRequestList && accessRequestList.value
    return value
  }

  retrieveAccessRequestByRequesterList = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const accountAddress = drizzleState.accounts[0]
    return ledger.getAccessRequestByRequesterList(accountAddress, 5)
  }

  readAccessRequestByRequesterList = () => {
    let { _getAccessRequestByRequesterListDataKey } = this.state
    const accessRequestList = this.props.drizzleState.contracts.AccessRequest.getAccessRequestByGranterList[_getAccessRequestByRequesterListDataKey]
    const value = accessRequestList && accessRequestList.value
    return value
  }

  retrieveAccessRequestsByGranter = accessRequestIds => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)

    let _getAccessRequestByGranterDataKey = {}
    accessRequestIds
      .filter(s => s > 0)
      .forEach(accessRequestId => {
        const _dataKey = ledger.getAccessRequestById(accessRequestId)
        _getAccessRequestByGranterDataKey[accessRequestId] = _dataKey
      })
    this.setState({ _getAccessRequestByGranterDataKey })
  }

  readAccessRequestsByGranter = () => {
    const { _getAccessRequestByGranterDataKey } = this.state

    let accessRequestResult = {}
    Object.keys(_getAccessRequestByGranterDataKey).forEach(requestId => {
      const result = this.props.drizzleState.contracts.AccessRequest.accessRequest[_getAccessRequestByGranterDataKey[requestId]]
      const data = result && result.value
      accessRequestResult[requestId] = data
    })
    return accessRequestResult
  }

  retrieveAccessRequestsByRequester = accessRequestIds => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)

    let _getAccessRequestByRequesterDataKey = {}
    accessRequestIds
      .filter(s => s > 0)
      .forEach(accessRequestId => {
        const _dataKey = ledger.getAccessRequestById(accessRequestId)
        _getAccessRequestByRequesterDataKey[accessRequestId] = _dataKey
      })
    this.setState({ _getAccessRequestByRequesterDataKey })
  }

  readAccessRequestsByRequester = () => {
    const { _getAccessRequestByRequesterDataKey } = this.state

    let accessRequestResult = {}
    Object.keys(_getAccessRequestByRequesterDataKey).forEach(requestId => {
      const result = this.props.drizzleState.contracts.AccessRequest.accessRequest[_getAccessRequestByRequesterDataKey[requestId]]
      const data = result && result.value
      accessRequestResult[requestId] = data
    })
    return accessRequestResult
  }

  // Pengajuan Akses yang pernah Anda buat:
  renderAccessRequestsByRequester = accessRequestList => {
    return <div className='request-page-list'>
    { Object.keys(accessRequestList).map(requestId => {
        const data = accessRequestList[requestId]
        if (!data) return null

        let className = 'request-page-list-item request-page-list-item-with-photo'
        if (data.status === 'DECLINED') className += ' request-page-list-danger'
        if (data.status === 'COMPLETED') className += ' request-page-list-success'

        const icon = data.status === 'DECLINED' ? accountIconWhite : accountIcon

        return <div key={'access-request-id-' + requestId} className={className}>
          <img src={icon} style={{ height: 50 }} />
          <div style={{ maxWidth: 340 }}>
            <div>ID Request: #{data.id}</div>
            <div style={{ fontSize: '1.2em', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data.granter}</div>
            <div>Status Permohonan: <span style={{ fontSize: '1.1em', fontWeight: '600' }}>{data.status}</span></div>
          </div>
        </div>
      }) }
    </div>
  }

  // Permintaan Akses Anda
  renderAccessRequestsByGranter = (accessRequestList, onSelect) => {
    return <div className='request-page-list'>
    { Object.keys(accessRequestList).map(requestId => {
        const data = accessRequestList[requestId]
        if (!data) return null

        let className = 'request-page-list-item request-page-list-item-with-photo'

        return <div key={'access-request-id-' + requestId} className={className}>
          <img src={accountIcon} style={{ height: 50 }} />
          <div style={{ maxWidth: 340 }}>
            <div>ID Request: #{data.id}</div>
            <div className='request-page-list-item-name'>{data.requester}</div>
            <div>{Button('Pilih', () => onSelect(requestId), 'primary', 'small', false, 'text')}</div>
          </div>
        </div>
      }) }
    </div>
  }
}

export default RequestPage