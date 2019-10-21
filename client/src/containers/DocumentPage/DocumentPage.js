import React from 'react'
import DocumentLedger from './ledger'

const FIELD = {
  DOCUMENT_TYPE: 'documentType',
  DOCUMENT_NUMBER: 'documentNumber', 
  DOCUMENT_ISSUER: 'documentIssuer',
  DOCUMENT_RECIPIENT: 'documentRecipient',
  DOCUMENT_DESCRIPTION: 'documentDescription',
}

class DocumentPage extends React.Component {
  state = {
    mode: 'CREATE', // 'LIST', 'VIEW'
    input: {
      documentType: 'INSURANCE_POLICY',
      documentNumber: '',
      documentIssuer: '',
      documentRecipient: '',
      documentDescription: '',
    },
    _getDocumentRecipientDataKey: null,
    _transactionStackId: null,
  }

  componentDidUpdate = prevProps => {
    const dataKey = this.state._getDocumentRecipientDataKey
    if (dataKey) {
      if (this.props.drizzleState.contracts.Account.accounts[dataKey] && !prevProps.drizzleState.contracts.Account.accounts[dataKey]) {
        const result = this.props.drizzleState.contracts.Account.accounts[dataKey]
        const accountData = result && result.value
        this.proceedCreateDocument(accountData)
      }
    }
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

    const listSection = <div>
      <h1>Your Document List</h1>
    </div>

    const viewSection = <div>
      <h1>Document #[documentId]</h1>
    </div>

    return <div>
      {createSection}
      {listSection}
      {viewSection}
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = event.target.value
    this.setState({ input: newInput })
  }

  handleSubmitButtonClick = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)
    const _getDocumentRecipientDataKey = ledger.getDocumentRecipientAccountInfo(this.state.input.documentRecipient)
    this.setState({ _getDocumentRecipientDataKey })

    if (_getDocumentRecipientDataKey in this.props.drizzleState.contracts.Account.accounts) {
      const result = this.props.drizzleState.contracts.Account.accounts[_getDocumentRecipientDataKey]
      const accountData = result && result.value
      this.proceedCreateDocument(accountData)
    }
  }

  proceedCreateDocument = recipientAccountData => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)
    const _transactionStackId = ledger.createDocument(recipientAccountData, this.state.input)
    this.setState({ _transactionStackId })
  }
}

export default DocumentPage