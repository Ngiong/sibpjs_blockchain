import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import DocumentLedger from './ledger'
import { decryptRSA } from './rsa'
import './styles.css'

import notFoundImg from './assets/not-found.png'

const FIELD = {
  DOCUMENT_TYPE: 'documentType',
  DOCUMENT_NUMBER: 'documentNumber', 
  DOCUMENT_ISSUER: 'documentIssuer',
  DOCUMENT_RECIPIENT: 'documentRecipient',
  DOCUMENT_DESCRIPTION: 'documentDescription',
  ACCOUNT_PRIVATE_KEY: 'accountPrivateKey',
}

class DocumentPage extends ReactDrizzleComponent {
  state = {
    input: {
      documentType: 'INSURANCE_POLICY',
      documentNumber: '',
      documentIssuer: '',
      documentRecipient: '',
      documentDescription: '',
      accountPrivateKey: '',
    },
    _getDocumentRecipientDataKey: null,
    _getOwnedDocumentListDataKey: null,
    _getDocumentDataKey: {},
    _transactionStackId: null,
  }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getDocumentRecipientDataKey', 'Account', 'account', this.proceedCreateDocument)
    this._drizzleStateDidUpdate(prevProps, '_getOwnedDocumentListDataKey', 'Document', 'getOwnedDocumentList', this.retrieveDocuments)
  }

  componentDidMount = () => {
    const _getOwnedDocumentListDataKey = this.retrieveOwnedDocumentList()
    this._drizzleStateIfExist(_getOwnedDocumentListDataKey, 'Document', 'getOwnedDocumentList', this.retrieveDocuments)
    this.setState({ _getOwnedDocumentListDataKey })

    const accountAddress = this.props.drizzleState.accounts[0]
    const _accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress)
    if (_accountPrivateKey) this.handleInputChange(FIELD.ACCOUNT_PRIVATE_KEY, _accountPrivateKey)
  }

  render = () => {
    const { input } = this.state

    const createSection = <div>
      <h1>Create Document</h1>

      <div>Document Type: </div>
      <div><input type='text' value={input.documentType} onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_TYPE)} /></div>
      <div>Document Number: </div>
      <div><input type='text' value={input.documentNumber} onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_NUMBER)} /></div>
      <div>Document Issuer: </div>
      <div><input type='text' value={input.documentIssuer} onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_ISSUER)} /></div>
      <div>Document Recipient: </div>
      <div><input type='text' value={input.documentRecipient} onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_RECIPIENT)} /></div>
      <div>Document Description: </div>
      <div><textarea value={input.documentDescription} onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_DESCRIPTION)} /></div>

      <div onClick={this.handleSubmitButtonClick}>Submit</div>
    </div>

    const ownedDocumentList = this.readOwnedDocumentList()
    const decipheredDocumentList = this.readDocument(input.accountPrivateKey)
    const rOwnedDocumentList = this.renderOwnedDocumentList(decipheredDocumentList)

    const invalidPrivateKeyMessage = <div className='document-page-invalid-private-key-message'>
      <img src={notFoundImg} style={{ width: '50%' }} />
      <h1>RSA Private Key tidak ditemukan.</h1><br/>
      Silakan masukkan RSA Private Key Anda pada halaman Profil.
    </div>

    const listSection = this.state.input.accountPrivateKey ? <div>
      <h1>{this.props.title}</h1>
      <div>Your Private Key: </div>
      <div><textarea value={input.accountPrivateKey} onChange={this.handleInputChange.bind(this, FIELD.ACCOUNT_PRIVATE_KEY)} /></div>
      {rOwnedDocumentList}
    </div> : invalidPrivateKeyMessage

    const viewSection = <div>
      <h1>Document #[documentId]</h1>
    </div>

    return <div>
      {createSection}{listSection}{viewSection}
      {/* {this.props.mode === 'CREATE' && createSection}
      {this.props.mode === 'LIST' && listSection}
      {this.props.mode === 'VIEW' && viewSection} */}
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = typeof(event) === 'string' ? event : event.target.value
    this.setState({ input: newInput })
  }

  handleSubmitButtonClick = () => {
    const _getDocumentRecipientDataKey = this.retrieveDocumentRecipient(this.state.input.documentRecipient)
    this._drizzleStateIfExist(_getDocumentRecipientDataKey, 'Account', 'account', this.proceedCreateDocument)
    this.setState({ _getDocumentRecipientDataKey })
  }

  retrieveDocumentRecipient = address => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)
    return ledger.getDocumentRecipientAccountInfo(address)
  }

  proceedCreateDocument = recipientAccountData => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)
    const _transactionStackId = ledger.createDocument(recipientAccountData, this.state.input)
    this.setState({ _transactionStackId })
  }

  retrieveOwnedDocumentList = () => {
    const { drizzle, drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]
    const ledger = new DocumentLedger(drizzle, drizzleState)
    return ledger.getOwnedDocumentList(accountAddress)
  }

  readOwnedDocumentList = () => {
    let { _getOwnedDocumentListDataKey } = this.state
    const ownedDocumentList = this.props.drizzleState.contracts.Document.getOwnedDocumentList[_getOwnedDocumentListDataKey]
    const value = ownedDocumentList && ownedDocumentList.value
    return value
  }

  renderOwnedDocumentList = documentList => {
    return <div>{JSON.stringify(documentList)}</div>
  }

  retrieveDocuments = documentIds => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)

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
    })
    return decryptionResult
  }
}

export default DocumentPage