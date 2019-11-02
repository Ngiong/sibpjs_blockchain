import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import { generateRSAKeyPair } from './rsa'
import AccountLedger from './ledger'
import './styles.css'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

import PrivateKeyDialog from './privateKeyDialog'

const FIELD = {
  ACCOUNT_TYPE: 'accountType',
  ACCOUNT_NAME: 'accountName',
  ACCOUNT_GENDER: 'accountGender',
  ACCOUNT_ADDRESS: 'accountAddress',
  ACCOUNT_PHONE_NUMBER: 'accountPhoneNumber',
  ACCOUNT_BPJS: 'accountBPJS',
  ACCOUNT_BIRTHDATE: 'accountBirthdate',

  ACCOUNT_LICENSE_NUMBER: 'accountLicenseNumber',
  ACCOUNT_LICENSE_VALIDITY: 'accountLicenseValidity',

  ACCOUNT_PIC_NAME: 'accountPICName',
  ACCOUNT_PIC_NPWP: 'accountPICNPWP',
  ACCOUNT_PIC_ROLE: 'accountPICRole',
  ACCOUNT_PIC_PHONE_NUMBER: 'accountPICPhoneNumber',

  ACCOUNT_PUBLIC_KEY: 'accountPublicKey',
  ACCOUNT_PRIVATE_KEY: 'accountPrivateKey',

  ACCOUNT_ACCEPT_AGREEMENT: 'accountAcceptAgreement',
}

const ACCOUNT_TYPE = {
  REGULAR: 'Regular',
  HEALTH_PROVIDER: 'Penyedia Layanan Kesehatan',
  INSURANCE_COMPANY: 'Perusahaan Asuransi'
}

const ACCOUNT_GENDER = { MALE: 'Pria', FEMALE: 'Wanita' }

class AccountPage extends ReactDrizzleComponent {
  state = {
    input: {
      accountType: 'REGULAR',
      accountName: '',
      accountAddress: '',
      accountPhoneNumber: '',
      accountBPJS: '',
      accountBirthdate: '',
      accountGender: '',
      accountLicenseNumber: '',
      accountLicenseValidity: '',
      accountPICName: '',
      accountPICNPWP: '',
      accountPICRole: '',
      accountPICPhoneNumber: '',
      accountPublicKey: '',
      accountPrivateKey: '',
      accountAcceptAgreement: false,
    },
    privateKeyDialog: false,
    _getAccountDataKey: null,
    _transactionStackId: null,
  }

  componentDidMount = () => { this.retrieveAccountData() }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getAccountDataKey', 'Account', 'account', accountData => {
      const accountAddress = this.props.drizzleState.accounts[0]
      this.restoreAccountData(accountData, accountAddress)
    })
    this._drizzleStateTxSuccess(prevProps, this.state._transactionStackId, this.handleCompletedForm)
  }

  render = () => {
    let { input } = this.state

    const regularSection = input.accountType === 'REGULAR' ? <div>
      <div className='account-page-section-title'>Data Diri</div>
      {TextField('Nama', input.accountName, this.handleInputChange.bind(this, FIELD.ACCOUNT_NAME))}
      {SelectField('Jenis Kelamin', ACCOUNT_GENDER, input.accountGender, this.handleInputChange.bind(this, FIELD.ACCOUNT_GENDER))}
      {TextField('Alamat', input.accountAddress, this.handleInputChange.bind(this, FIELD.ACCOUNT_ADDRESS))}
      {DateField('Tanggal Lahir', input.accountBirthdate, this.handleInputChange.bind(this, FIELD.ACCOUNT_BIRTHDATE))}
      {TextField('Nomor Telepon', input.accountPhoneNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_PHONE_NUMBER))}
      {TextField('Nomor BPJS', input.accountBPJS, this.handleInputChange.bind(this, FIELD.ACCOUNT_BPJS))}
    </div> : null

    const healthProviderSection = input.accountType === 'HEALTH_PROVIDER' ? <div>
      <div className='account-page-section-title'>Data Perusahaan</div>
      {TextField('Nama Instansi', input.accountName, this.handleInputChange.bind(this, FIELD.ACCOUNT_NAME))}
      {TextField('Alamat Instansi', input.accountAddress, this.handleInputChange.bind(this, FIELD.ACCOUNT_ADDRESS))}
      {TextField('Nomor Telepon Kantor', input.accountPhoneNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_PHONE_NUMBER))}
      
      <div className='account-page-section-title'>Perizinan</div>
      {TextField('Nomor Dokumen Izin', input.accountLicenseNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_LICENSE_NUMBER))}
      {DateField('Masa Berlaku Izin', input.accountLicenseValidity, this.handleInputChange.bind(this, FIELD.ACCOUNT_LICENSE_VALIDITY))}
      
      <div className='account-page-section-title'>Penanggung Jawab</div>
      {TextField('Nama PIC', input.accountPICName, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_NAME))}
      {TextField('NPWP PIC', input.accountPICNPWP, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_NPWP))}
      {TextField('Jabatan', input.accountPICRole, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_ROLE))}
      {TextField('Kontak PIC', input.accountPICPhoneNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_PHONE_NUMBER))}
    </div> : null

    const insuranceCompanySection = input.accountType === 'INSURANCE_COMPANY' ? <div>
      <div className='account-page-section-title'>Data Perusahaan</div>
      {TextField('Nama Instansi', input.accountName, this.handleInputChange.bind(this, FIELD.ACCOUNT_NAME))}
      {TextField('Alamat Instansi', input.accountAddress, this.handleInputChange.bind(this, FIELD.ACCOUNT_ADDRESS))}
      {TextField('Nomor Telepon Kantor', input.accountPhoneNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_PHONE_NUMBER))}
      
      <div className='account-page-section-title'>Perizinan</div>
      {TextField('Nomor Dokumen Izin', input.accountLicenseNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_LICENSE_NUMBER))}
      {DateField('Masa Berlaku Izin', input.accountLicenseValidity, this.handleInputChange.bind(this, FIELD.ACCOUNT_LICENSE_VALIDITY))}
      
      <div className='account-page-section-title'>Penanggung Jawab</div>
      {TextField('Nama PIC', input.accountPICName, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_NAME))}
      {TextField('NPWP PIC', input.accountPICNPWP, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_NPWP))}
      {TextField('Jabatan', input.accountPICRole, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_ROLE))}
      {TextField('Kontak PIC', input.accountPICPhoneNumber, this.handleInputChange.bind(this, FIELD.ACCOUNT_PIC_PHONE_NUMBER))}
    </div> : null

    const rsaSection = <div>
      <div className='account-page-section-title'>RSA Key</div>
      <div>
        { !input.accountPublicKey &&
          Button('Buat Kunci RSA', this.handleGenerateButtonClick, 'primary', 'small', false, 'outlined') }
      </div>
      { input.accountPublicKey && <div>
        {Label('Public Key')}
        <div><pre className='account-page-section-rsa'>{input.accountPublicKey}</pre></div>
        {Label('Private Key')}
        <div><pre className='account-page-section-rsa'>{input.accountPrivateKey || 'Private key belum tersimpan pada browser Anda.'}</pre>
        { !input.accountPrivateKey &&
          Button('Input Manual Private Key', () => this.setState({ privateKeyDialog: true }), 'primary', 'medium', false, 'text') }
        { !input.accountPrivateKey &&
          <PrivateKeyDialog visible={this.state.privateKeyDialog} publicKey={input.accountPublicKey}
                            onClose={() => this.setState({ privateKeyDialog: false })}
                            onSubmit={this.handleStorePrivateKey} /> }
        </div>
      </div> }
    </div>

    return <div className='account-page-container animated zoomIn faster'>
      <h1>Profil Anda</h1>
      <div>
        { SelectField('Tipe Akun', ACCOUNT_TYPE, input.accountType, this.handleInputChange.bind(this, FIELD.ACCOUNT_TYPE)) }
        { regularSection }
        { healthProviderSection }
        { insuranceCompanySection }
        { rsaSection }
        <div style={{ marginTop: 36 }}>
          {Checkbox(input.accountAcceptAgreement, <span style={{ fontSize: 14 }}>
            Saya setuju dengan syarat dan ketentuan yang berlaku pada aplikasi SiBPJS.
          </span>, this.handleInputChange.bind(this, FIELD.ACCOUNT_ACCEPT_AGREEMENT), 'primary')}
          {Button('Simpan', this.handleSubmitButtonClick, 'primary', 'small', !this.completedForm())}
        </div>
      </div>
    </div>
  }

  handleInputChange = (field, value) => {
    let newInput = { ...this.state.input }
    newInput[field] = value
    this.setState({ input: newInput })
  }

  handleGenerateButtonClick = () => {
    const result = generateRSAKeyPair()
    let newInput = { ...this.state.input, accountPrivateKey: result.privateKey, accountPublicKey: result.publicKey }
    this.setState({ input: newInput })
  }

  handleSubmitButtonClick = () => {
    const { drizzle, drizzleState } = this.props
    const ledger = new AccountLedger(drizzle, drizzleState)
    const _transactionStackId = ledger.createAccount(this.state.input)
    this.setState({ _transactionStackId })
  }

  retrieveAccountData = () => {
    const contract = this.props.drizzle.contracts.Account
    const accountAddress = this.props.drizzleState.accounts[0]
    const _getAccountDataKey = contract.methods['account'].cacheCall(accountAddress)
    this._drizzleStateIfExist(_getAccountDataKey, 'Account', 'account', accountData => this.restoreAccountData(accountData, accountAddress))
    this.setState({ _getAccountDataKey })
  }

  readAccountData = () => {
    const { Account } = this.props.drizzleState.contracts
    const accountData = Account.account[this.state._getAccountDataKey]
    return accountData && accountData.value
  }

  restoreAccountData = (accountData, accountAddress) => {
    if (accountData && accountData.accountPublicKey && !this.state.input.accountPublicKey) {
      const accountProperties = JSON.parse(accountData.data)
      const accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress) || ''
      const input = {
        accountType: accountData.accountType || 'REGULAR',
        accountName: accountData.accountName || accountProperties.accountName || '',
        accountAddress: accountData.accountAddress || '',
        accountPhoneNumber: accountData.accountPhoneNumber || '',
        accountBPJS: accountProperties.accountBPJS || '',
        accountBirthdate: accountProperties.accountBirthdate || '',
        accountGender: accountProperties.accountGender || '',
        accountLicenseNumber: accountProperties.accountLicenseNumber || '',
        accountLicenseValidity: accountProperties.accountLicenseValidity || '',
        accountPICName: accountProperties.accountPICName || '',
        accountPICNPWP: accountProperties.accountPICNPWP || '',
        accountPICRole: accountProperties.accountPICRole || '',
        accountPICPhoneNumber: accountProperties.accountPICPhoneNumber || '',
        accountPublicKey: accountData.accountPublicKey || '',
        accountPrivateKey: accountPrivateKey,
        accountAcceptAgreement: false,
      }
      this.setState({ input })
    }
  }

  handleCompletedForm = () => {
    this.handleStorePrivateKey(this.state.input.accountPrivateKey)
    window.SHOW_TOAST('Data profil berhasil disimpan.')
    this.props.history.push('/')
  }

  handleStorePrivateKey = privateKey => {
    if (!privateKey) return
    this.handleInputChange(FIELD.ACCOUNT_PRIVATE_KEY, privateKey)

    const accountAddress = this.props.drizzleState.accounts[0]
    localStorage.setItem('accountPrivateKey#' + accountAddress, privateKey)
  }

  completedForm = () => {
    const { input } = this.state
    const validAccountType = Object.keys(ACCOUNT_TYPE).find(s => s === input.accountType)
    if (!validAccountType) return false

    const allFilled = fieldNames => fieldNames
      .map(fieldName => input[fieldName])
      .reduce((prev, item) => prev && item, true)

    let storedFieldForData = []
    if (input.accountType === 'REGULAR')
      storedFieldForData = ['accountBPJS', 'accountBirthdate', 'accountGender']
    else
      storedFieldForData = ['accountLicenseNumber', 'accountLicenseValidity',
      'accountPICName', 'accountPICNPWP', 'accountPICRole', 'accountPICPhoneNumber']

    const validProperties = allFilled(storedFieldForData)
    if (!validProperties) return false

    const generalFields = ['accountName', 'accountAddress', 'accountPhoneNumber', 'accountPublicKey', 'accountAcceptAgreement']
    const validGeneralFields = allFilled(generalFields)
    return validGeneralFields
  }
}

export default withRouter(AccountPage)