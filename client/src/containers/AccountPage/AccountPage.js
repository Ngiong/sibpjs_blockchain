import React from 'react'
import { generateRSAKeyPair } from './rsa'
import AccountLedger from './ledger'

const FIELD = {
  ACCOUNT_TYPE: 'accountType',
  ACCOUNT_NAME: 'accountName',
  PUBLIC_KEY: 'publicKey',
  PRIVATE_KEY: 'privateKey',
  ACCOUNT_PROPERTIES: 'accountProperties',
  BPJS_IDENTITY_NUMBER: 'bpjsIdentityNumber',
  ADDRESS: 'address',
}

class AccountPage extends React.Component {
  state = {
    input: {
      accountType: 'REGULAR',
      accountName: '',
      publicKey: '',
      privateKey: '',
      accountProperties: {},
    },
    stackId: null
  }

  render = () => {
    let { input } = this.state
    let { accountProperties } = input

    const textStyle = { width: '100%' }

    const regularSection = <div>
      <div>Nomor BPJS: </div>
      <div><input type='text' value={accountProperties.bpjsIdentityNumber} onChange={this.handlePropertyChange.bind(this, FIELD.BPJS_IDENTITY_NUMBER)} /></div>
    </div>

    const healthProviderSection = <div>
      <div>Alamat Instansi: </div>
      <div><input type='text' value={accountProperties.address} onChange={this.handlePropertyChange.bind(this, FIELD.ADDRESS)} /></div>
    </div>

    return <div>
      <h1>Account Page</h1>
      <div>
        <div>Account Type: </div>
        <div><input type='text' value={input.accountType} onChange={this.handleInputChange.bind(this, FIELD.ACCOUNT_TYPE)} /></div>

        <div>Nama: </div>
        <div><input type='text' value={input.accountName} onChange={this.handleInputChange.bind(this, FIELD.ACCOUNT_NAME)} /></div>

        <hr />

        <div>Public Key: </div>
        <div><input type='text' value={input.publicKey} disabled style={textStyle} /></div>

        <div>Public Key: </div>
        <div><input type='text' value={input.privateKey} disabled style={textStyle} /></div>
        
        <div onClick={this.handleGenerateButtonClick}>Generate</div>

        <hr />

        { input.accountType !== 'HEALTH_PROVIDER' ? regularSection : healthProviderSection }

        <div onClick={this.handleSubmitButtonClick}>Submit</div>

        <hr />
        <div>Status Transaksi Anda: { this.getTransactionStatus() }</div>
      </div>
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = event.target.value
    this.setState({ input: newInput })
  }

  handlePropertyChange = (field, event) => {
    let newInput = { ...this.state.input }
    let newProperties = { ...this.state.input.accountProperties }
    newProperties[field] = event.target.value
    newInput.accountProperties = newProperties
    this.setState({ input: newInput })
  }

  handleGenerateButtonClick = () => {
    const result = generateRSAKeyPair()
    let newInput = { ...this.state.input, ...result }
    this.setState({ input: newInput })
  }

  handleSubmitButtonClick = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccountLedger(drizzle, drizzleState)
    const stackId = ledger.createAccount(this.state.input)
    this.setState({ stackId })
  }

  getTransactionStatus = () => {
    if (this.state.stackId === null) return 'Not connected.'
    const { drizzle, drizzleState } = this.props
    const ledger = new AccountLedger(drizzle, drizzleState)
    ledger.getTransactionStatus(this.state.stackId)
  }
}

export default AccountPage