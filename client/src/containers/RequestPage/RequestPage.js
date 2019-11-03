import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import AccessRequestLedger from './ledger'
import { encryptRSA, decryptRSA } from './rsa'

import {Grid} from '@material-ui/core'

import Card from '../../components/Card'
import Activity from '../../components/Activity'
import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

import './styles.css'

import accountIcon from './assets/account-icon.png'
import accountIconWhite from './assets/account-icon-white.png'
import noRequestImg from './assets/no-request.png'

const FIELD = {
  REQUEST_TO: 'requestTo',
  ACCOUNT_PRIVATE_KEY: 'accountPrivateKey',
  CHOSEN_REQUEST_ENTRY: 'chosenRequestEntry',
}

class RequestPage extends ReactDrizzleComponent {
  state = {
    input: {
      requestTo: '',
      accountPrivateKey: '',
      chosenRequestEntry: {},
      chosenDocuments: [],
    },
    selectDialogActivity: false,

    _getAccessRequestByGranterListDataKey: null,
    _getAccessRequestByGranterDataKey: {},
    _getAccessRequestByRequesterListDataKey: null,
    _getAccessRequestByRequesterDataKey: {},

    _getOwnedDocumentListDataKey: null,
    _getDocumentDataKey: {},
    _getRequesterAccountDataKey: null,
    _getAuthorizedDocumentDataKey: {},

    _requestingTxStackId: null,
    _grantingTxStackId: null,
  }
  decipheredDocument = {}

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getAccessRequestByGranterListDataKey', 'AccessRequest', 'getAccessRequestByGranterList', this.retrieveAccessRequestsByGranter)
    this._drizzleStateDidUpdate(prevProps, '_getAccessRequestByRequesterListDataKey', 'AccessRequest', 'getAccessRequestByRequesterList', this.retrieveAccessRequestsByRequester)
    this._drizzleStateDidUpdate(prevProps, '_getOwnedDocumentListDataKey', 'Document', 'getOwnedDocumentList', this.retrieveDocuments)
    this._drizzleStateDidUpdate(prevProps, '_getRequesterAccountDataKey', 'Account', 'account', this.proceedGrantDocument)

    this._drizzleStateTxSuccess(prevProps, this.state._grantingTxStackId, this.handleGrantingComplete)
    this._drizzleStateTxSuccess(prevProps, this.state._requestingTxStackId, this.handleRequestingComplete)
  }

  componentDidMount = () => {
    const _getAccessRequestByGranterListDataKey = this.retrieveAccessRequestByGranterList()
    this._drizzleStateIfExist(_getAccessRequestByGranterListDataKey, 'AccessRequest', 'getAccessRequestByGranterList', this.retrieveAccessRequestsByGranter)
    this.setState({ _getAccessRequestByGranterListDataKey })

    const _getAccessRequestByRequesterListDataKey = this.retrieveAccessRequestByRequesterList()
    this._drizzleStateIfExist(_getAccessRequestByRequesterListDataKey, 'AccessRequest', 'getAccessRequestByRequesterList', this.retrieveAccessRequestsByRequester)
    this.setState({ _getAccessRequestByRequesterListDataKey })

    const _getOwnedDocumentListDataKey = this.retrieveOwnedDocumentList()
    this._drizzleStateIfExist(_getOwnedDocumentListDataKey, 'Document', 'getOwnedDocumentList', this.retrieveDocuments)
    this.setState({ _getOwnedDocumentListDataKey })

    const accountAddress = this.props.drizzleState.accounts[0]
    const _accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress)
    if (_accountPrivateKey) this.handleInputChange(FIELD.ACCOUNT_PRIVATE_KEY, _accountPrivateKey)
  }

  render = () => {
    const { input } = this.state

    const createRequestSection = <div>
      <h1>Pembuatan Permohonan Akses</h1>
      <div>Ajukan permohonan dokumen kepada pengguna lain pada halaman ini.</div>

      <div style={{ height: '2em' }}/>
      {TextField('Tujuan Permohonan', input.requestTo, this.handleInputChange.bind(this, FIELD.REQUEST_TO))}
      <div style={{ height: '1em' }} />
      {Button('Kirim', this.handleCreateRequestSubmission, 'secondary', 'large', false, 'outlined')}

    </div>

    const accessRequestsByRequester = this.readAccessRequestsByRequester()
    const rAccessRequestsByRequester = this.renderAccessRequestsByRequester(accessRequestsByRequester)

    const sentRequestListSection = <div style={{ marginTop: '5em' }}>
      <h2>Pengajuan akses sebelumnya:</h2>
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

    const decipheredDocumentList = this.readDocument(input.accountPrivateKey)
    const rOwnedDocumentList = this.renderOwnedDocumentList(decipheredDocumentList)

    const documentSelectionSection = <div style={{ width: '100%' }}>
      <h1>Pemberian Akses #{this.state.input.chosenRequestEntry.id}</h1>
      <h3><div style={{ fontWeight: 500, color: 'black' }}>Kepada:</div>
      <div style={{ fontSize: '1.1em', overflowY: 'hidden', textOverflow: 'ellipsis'}}> {this.state.input.chosenRequestEntry.granter}</div></h3>
      { rOwnedDocumentList }
      {/* <div>{Button('Kirim', this.handleGrantButtonOnClick, 'secondary', 'small', this.shouldDisableGrantButton())}</div> */}
    </div>

    if (this.props.mode === 'GRANT')
      return <div className='animated zoomIn faster'>
        {receivedRequestListSection}
        {Activity(this.state.selectDialogActivity, 'Pilih Dokumen', documentSelectionSection, () => this.setState({ selectDialogActivity: false }),
        { text: 'KIRIM', onClick: this.handleGrantButtonOnClick })}
      </div>

    if (this.props.mode === 'REQUEST')
      return <div className='animated zoomIn faster'>
        {createRequestSection}
        {sentRequestListSection}
      </div>
    
    return null
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = typeof(event) === 'string' ? event : event.target.value
    this.setState({ input: newInput })
  }

  handleSelectAccessRequest = requestData => {
    let newInput = { ...this.state.input }
    newInput.chosenRequestEntry = requestData
    this.setState({ input: newInput, selectDialogActivity: true })
  }

  handleCreateRequestSubmission = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const accountAddress = drizzleState.accounts[0]
    const _requestingTxStackId = ledger.createAccessRequest(accountAddress, this.state.input.requestTo)
    this.setState({ _requestingTxStackId })
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
    Object.keys(_getAccessRequestByGranterDataKey).filter(requestId => requestId > 0).forEach(requestId => {
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
    const content = Object.keys(accessRequestList).map(requestId => {
      const data = accessRequestList[requestId]
      if (!data) return null

      let className = 'request-page-list-item request-page-list-item-with-photo'
      if (data.status === 'DECLINED') className += ' request-page-list-danger'
      if (data.status === 'COMPLETED') className += ' request-page-list-success'

      const icon = data.status === 'DECLINED' ? accountIconWhite : accountIcon

      return <div key={'access-request-id-' + requestId} className={className}>
        <img src={icon} style={{ height: 50 }} />
        <div style={{ maxWidth: '70%' }}>
          <div>ID Request: #{data.id}</div>
          <div style={{ fontSize: '1.2em', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data.granter}</div>
          <div>Status Permohonan: <span style={{ fontSize: '1.1em', fontWeight: '600' }}>{data.status}</span></div>
          { data.status ==='COMPLETED' && 
          <div>Granted ID: <span style={{ fontSize: '1.1em', fontWeight: '600' }}>#{data.authorizedDocumentId}</span></div> }
        </div>
      </div>
    })
    
    const emptyList = content.filter(s => s).length === 0

    return <div className='request-page-list'>
      { emptyList ? 'Anda belum pernah membuat pengajuan akses kepada siapapun.' : content.reverse() }
    </div>
  }

  // Permintaan Akses Anda
  renderAccessRequestsByGranter = (accessRequestList, onSelect) => {
    const content = Object.keys(accessRequestList).map(requestId => {
      const data = accessRequestList[requestId]
      if (!data) return null

      let className = 'request-page-list-item request-page-list-item-with-photo'

      return <div key={'access-request-id-' + requestId} className={className}>
        <img src={accountIcon} style={{ height: 50 }} />
        <div style={{ maxWidth: '70%' }}>
          <div>ID Request: #{data.id}</div>
          <div className='request-page-list-item-name'>{data.requester}</div>
          <div>{Button('Pilih', () => onSelect(data), 'primary', 'small', false, 'text')}</div>
        </div>
      </div>
    })

    const emptyList = content.filter(s => s).length === 0

    return <div className='request-page-list'>
      { emptyList ? <div style={{ textAlign: 'center'}}>
        <img src={noRequestImg} style={{ width: '50%' }} />
        <h1 style={{ fontWeight: 500 }}>Permintaan Akses <br/> Tidak Ditemukan</h1>
      </div> : content.reverse() }
    </div>
  }

  retrieveOwnedDocumentList = () => {
    const { drizzle, drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    return ledger.getOwnedDocumentList(accountAddress)
  }

  retrieveDocuments = documentIds => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)

    let _getDocumentDataKey = {}
    documentIds.forEach(documentId => {
      const _dataKey = ledger.getDocumentById(documentId)
      _getDocumentDataKey[documentId] = _dataKey
    })
    this.setState({ _getDocumentDataKey })
  }

  readDocument = privateKey => {
    const { _getDocumentDataKey } = this.state

    let decryptionResult = {}
    Object.keys(_getDocumentDataKey).forEach(documentId => {
      const result = this.props.drizzleState.contracts.Document.ownedDocumentData[_getDocumentDataKey[documentId]]
      const cipher = result && result.value.data
      const data = decryptRSA(privateKey, cipher)
      decryptionResult[documentId] = data
      this.decipheredDocument[documentId] = data
    })
    return decryptionResult
  }

  renderOwnedDocumentList = documentList => {
    if (!documentList) return null
    const cardElements = Object.keys(documentList).map((documentId, idx) => {
      let document = {}
      try {
        document = JSON.parse(documentList[documentId])
      } catch (err) {
        return null
      }
      const documentType = document.documentType
      const documentAction = <div>
        {Checkbox(this.isDocumentChosen(documentId), 'Terpilih', () => this.handleCheckboxClick(documentId))}
      </div>
      return <Grid key={idx} item md={6} sm={12} xs={12}>
        <Card title='Nama RS/Company' documentId={documentId} date='{documentCreatedAt}'
              description='{documentShortDescription}' documentType={documentType} actions={documentAction} />
      </Grid>
    }).filter(s => s)
    if (cardElements.length === 0) {
      return <Grid item md={12} sm={12} xs={12}><div style={{ textAlign: 'center' }}>
        <h1 style={{ fontWeight: 500 }}>Dokumen Tidak Ditemukan.</h1>
        </div></Grid>
    }

//     const data = JSON.parse(documentList[s])
// -        return <div key={idx} style={{ background: 'pink', margin: '5px 0' }}>
// -          <div>DocumentId: {s}</div>
// -          <div>DocumentType: {data.documentType}</div>
// -          
// -        </div>
    
    return <Grid container spacing={3}>{ cardElements }</Grid>
  }

  isDocumentChosen = documentId => !!this.state.input.chosenDocuments.find(s => s === documentId)
  handleCheckboxClick = documentId => {
    const newInput = { ...this.state.input }
    
    if (this.isDocumentChosen(documentId))
      newInput.chosenDocuments = newInput.chosenDocuments.filter(s => s !== documentId)
    else
      newInput.chosenDocuments = [...newInput.chosenDocuments, documentId]
    
    this.setState({ input: newInput })
  }

  shouldDisableGrantButton = () => !this.state.input.chosenRequestEntry.requester

  handleGrantButtonOnClick = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const _getRequesterAccountDataKey = ledger.getAccountInfo(this.state.input.chosenRequestEntry.requester)
    this._drizzleStateIfExist(_getRequesterAccountDataKey, 'Account', 'account', this.proceedGrantDocument)
    this.setState({ _getRequesterAccountDataKey })
  }

  proceedGrantDocument = requesterAccountData => {
    const { input } = this.state
    const documentList = input.chosenDocuments.map(documentId => { return JSON.parse(this.decipheredDocument[documentId]) })
    const cipher = encryptRSA(requesterAccountData.accountPublicKey, JSON.stringify(documentList))
    
    const { drizzle, drizzleState } = this.props
    const ledger = new AccessRequestLedger(drizzle, drizzleState)
    const _grantingTxStackId = ledger.authorizeDocument(input.chosenRequestEntry.id, input.chosenRequestEntry.requester, cipher,
      documentList.length === 0 ? 'DECLINED' : 'COMPLETED')
    this.setState({ _grantingTxStackId })
  }

  handleGrantingComplete = () => {
    window.SHOW_TOAST('Selamat! Pemberian akses telah berhasil dilakukan.')
    this.props.history.push('/')
  }

  handleRequestingComplete = () => {
    window.SHOW_TOAST(<div>
      <div>Permohonan Akses telah berhasil dikirim.</div>
      <div>Silakan cek secara berkala untuk mengetahui status permohonan Anda.</div>
    </div>)
    const newInput = { ...this.state.input }
    newInput.requestTo = ''
    this.setState({ input: newInput })
  }
}

export default withRouter(RequestPage)