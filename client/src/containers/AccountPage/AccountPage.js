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
    _getAccountDataKey: null,
    _transactionStackId: null,
  }

  componentDidMount = () => {
    const contract = this.props.drizzle.contracts.Account
    const accountAddress = this.props.drizzleState.accounts[0]
    const _getAccountDataKey = contract.methods['account'].cacheCall(accountAddress)
    this.setState({ _getAccountDataKey })
  }

  // componentDidUpdate = prevProps => {
  //   if (this.props.drizzleState !== prevProps.drizzleState) {
  //     this.retrieveStoredContract()
  //   }
  // }

  render = () => {
    let { input } = this.state
    let { accountProperties } = input

    this.retrieveStoredContract()

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
        <div><pre>{input.publicKey}</pre></div>

        <div>Public Key: </div>
        <div><pre>{input.privateKey}</pre></div>
        
        <div onClick={this.handleGenerateButtonClick}>Generate</div>

        <hr />

        { input.accountType !== 'HEALTH_PROVIDER' ? regularSection : healthProviderSection }

        <div onClick={this.handleSubmitButtonClick}>Submit</div>

        <hr />
        <div>Status Transaksi Anda: { this.getTransactionStatus() }</div>
      </div>
    </div>
  }

  retrieveStoredContract = () => {
    const { Account } = this.props.drizzleState.contracts
    const accountData = Account.account[this.state._getAccountDataKey]
    const value = accountData && accountData.value

    if (value && value.publicKey && !this.state.input.publicKey) {
      const accountProperties = JSON.parse(value.data)
      const input = {
        accountType: value.accountType,
        accountName: accountProperties.accountName,
        publicKey: value.publicKey,
        privateKey: 'Hanya Anda yang menyimpan private key',
        accountProperties: accountProperties,
      }
      this.setState({ input })
    }
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
    const _transactionStackId = ledger.createAccount(this.state.input)
    this.setState({ _transactionStackId })
  }

  getTransactionStatus = () => {
    if (this.state._transactionStackId === null) return 'Not connected.'
    const { drizzle, drizzleState } = this.props
    const ledger = new AccountLedger(drizzle, drizzleState)
    ledger.getTransactionStatus(this.state._transactionStackId)
  }
}

export default AccountPage