import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import { generateRSAKeyPair } from './rsa'
import AccountLedger from './ledger'
import './styles.css'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'

const FIELD = {
  ACCOUNT_TYPE: 'accountType',
  ACCOUNT_NAME: 'accountName',
  PUBLIC_KEY: 'publicKey',
  PRIVATE_KEY: 'privateKey',
  ACCOUNT_PROPERTIES: 'accountProperties',
  BPJS_IDENTITY_NUMBER: 'bpjsIdentityNumber',
  ADDRESS: 'address',
  BIRTHDAY: 'birthday',
}

const transformInputValue = (field, value) => {
  switch (field) {
    case FIELD.BIRTHDAY: return value
    case FIELD.ACCOUNT_NAME: return value
    default: return value.target.value
  }
}

class AccountPage extends ReactDrizzleComponent {
  state = {
    input: {
      accountType: 'REGULAR',
      accountName: '',
      publicKey: '',
      privateKey: '',
      accountProperties: {
        bpjsIdentityNumber: '',
        address: '',
        birthday: '',
      },
    },
    _getAccountDataKey: null,
    _transactionStackId: null,
  }

  componentDidMount = () => { this.retrieveAccountData() }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getAccountDataKey', 'Account', 'account', this.restoreAccountData)
  }

  render = () => {
    let { input } = this.state
    let { accountProperties } = input

    const regularSection = <div>
      <div>Nomor BPJS: </div>
      <div><input type='text' value={accountProperties.bpjsIdentityNumber} onChange={this.handlePropertyChange.bind(this, FIELD.BPJS_IDENTITY_NUMBER)} /></div>
    </div>

    const healthProviderSection = <div>
      <div>Alamat Instansi: </div>
      <div><input type='text' value={accountProperties.address} onChange={this.handlePropertyChange.bind(this, FIELD.ADDRESS)} /></div>
    </div>

    return <div className='account-page-container'>
      <h1>Account Page</h1>
      <div>
        <div>Account Type: </div>
        <div><input type='text' value={input.accountType} onChange={this.handleInputChange.bind(this, FIELD.ACCOUNT_TYPE)} /></div>

        {TextField('Nama', this.handleInputChange.bind(this, FIELD.ACCOUNT_NAME))}
        {DateField('Tanggal Lahir', accountProperties.birthday || new Date(), this.handlePropertyChange.bind(this, FIELD.BIRTHDAY))}
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

  handleInputChange = (field, value) => {
    let newInput = { ...this.state.input }
    newInput[field] = transformInputValue(field, value)
    this.setState({ input: newInput })
  }

  handlePropertyChange = (field, value) => {
    let newInput = { ...this.state.input }
    let newProperties = { ...this.state.input.accountProperties }
    newProperties[field] = transformInputValue(field, value)
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

  retrieveAccountData = () => {
    const contract = this.props.drizzle.contracts.Account
    const accountAddress = this.props.drizzleState.accounts[0]
    const _getAccountDataKey = contract.methods['account'].cacheCall(accountAddress)
    this._drizzleStateIfExist(_getAccountDataKey, 'Account', 'account', this.restoreAccountData)
    this.setState({ _getAccountDataKey })
  }

  readAccountData = () => {
    const { Account } = this.props.drizzleState.contracts
    const accountData = Account.account[this.state._getAccountDataKey]
    return accountData && accountData.value
  }

  restoreAccountData = accountData => {
    if (accountData && accountData.publicKey && !this.state.input.publicKey) {
      const accountProperties = JSON.parse(accountData.data)
      const input = {
        accountType: accountData.accountType,
        accountName: accountProperties.accountName,
        publicKey: accountData.publicKey,
        privateKey: 'Hanya Anda yang menyimpan private key',
        accountProperties: accountProperties,
      }
      this.setState({ input })
    }
  }
}

export default AccountPage