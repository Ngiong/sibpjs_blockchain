import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import DocumentLedger from './ledger'
import {Grid} from '@material-ui/core'
import { decryptRSA } from './rsa'
import './styles.css'

import notFoundImg from './assets/not-found.png'
import Card from '../../components/Card'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

const FIELD = {
  DOCUMENT_TYPE: 'documentType',
  DOCUMENT_NUMBER: 'documentNumber', 
  DOCUMENT_RECIPIENT: 'documentRecipient',
  DOCUMENT_SHORT_DESCRIPTION: 'documentShortDescription',
  DOCUMENT_CREATED_AT: 'documentCreatedAt',

  MEDICAL_SYMPTOMS: 'medicalSymptoms',
  MEDICAL_DIAGNOSIS: 'medicalDiagnosis',
  MEDICAL_DOCTOR: 'medicalDoctor',
  MEDICAL_TREATMENT: 'medicalTreatment',
  MEDICAL_PRESCRIPTION: 'medicalPrescription',

  CLAIM_HEALTH_PROVIDER_NAME: 'claimHealthProviderName',
  CLAIM_VISIT_DATE: 'claimVisitDate',
  CLAIM_DIAGNOSIS: 'claimDiagnosis',
  CLAIM_AMOUNT: 'claimAmount',

  POLICY_CLIENT_NAME: 'policyClientName',
  POLICY_ALLOWED_PROVIDERS: 'policyAllowedProviders',
  POLICY_ALLOWED_TREAMENTS: 'policyAllowedTreatments',
  POLICY_TNC: 'policyTnC',
  POLICY_MAX_CLAIMS: 'policyMaxClaims',

  DOCUMENT_ADDITIONAL_DESCRIPTION: 'documentAdditionalDescription',
  DOCUMENT_ACCEPT_AGREEMENT: 'documentAcceptAgreement',
  ACCOUNT_PRIVATE_KEY: 'accountPrivateKey',
}

const DOCUMENT_TYPE_HEALTH = {
  MEDICAL_RECORD: 'Rekam Medis',
  INSURANCE_CLAIM: 'Klaim Asuransi',
  INSURANCE_POLICY: 'Polis Asuransi',
}

class DocumentPage extends ReactDrizzleComponent {
  state = {
    input: {
      documentType: 'MEDICAL_RECORD',
      documentNumber: '',
      documentRecipient: '',
      documentShortDescription: '',
      documentCreatedAt: '',

      medicalSymptoms: '',
      medicalDiagnosis: '',
      medicalDoctor: '',
      medicalTreatment: '',
      medicalPrescription: '',

      claimHealthProviderName: '',
      claimVisitDate: '',
      claimDiagnosis: '',
      claimAmount: '',

      policyClientName: '',
      policyAllowedProviders: '',
      policyAllowedTreatments: '',
      policyTnC: '',
      policyMaxClaims: '',

      documentAdditionalDescription: '',
      documentAcceptAgreement: '',
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
    // const _accountPrivateKey = localStorage.getItem('accountPrivateKey')
    // if (_accountPrivateKey) this.handleInputChange(FIELD.ACCOUNT_PRIVATE_KEY, _accountPrivateKey)
  }

  render = () => {
    const { input } = this.state

    const medicalSection = input.documentType === 'MEDICAL_RECORD' ? <div>
      <div className='account-page-section-title'>Informasi Rekam Medis</div>
      {TextField('Gejala', input.medicalSymptoms, this.handleInputChange.bind(this, FIELD.MEDICAL_SYMPTOMS))}
      {TextField('Diagnosis', input.medicalDiagnosis, this.handleInputChange.bind(this, FIELD.MEDICAL_DIAGNOSIS))}
      {TextField('Nama Dokter', input.medicalDoctor, this.handleInputChange.bind(this, FIELD.MEDICAL_DOCTOR))}
      {TextField('Penanganan', input.medicalTreatment, this.handleInputChange.bind(this, FIELD.MEDICAL_TREATMENT))}
      {TextField('Resep Dokter (jika ada)', input.medicalPrescription, this.handleInputChange.bind(this, FIELD.MEDICAL_PRESCRIPTION))}
    </div> : null

    const claimSection = input.documentType === 'INSURANCE_CLAIM' ? <div>
      <div className='account-page-section-title'>Informasi Klaim</div>
      {TextField('Nama Penyedia Layanan Kesehatan', input.claimHealthProviderName, this.handleInputChange.bind(this, FIELD.CLAIM_HEALTH_PROVIDER_NAME))}
      {DateField('Tanggal Kunjungan', input.claimVisitDate, this.handleInputChange.bind(this, FIELD.CLAIM_VISIT_DATE))}
      {TextField('Diagnosis', input.claimDiagnosis, this.handleInputChange.bind(this, FIELD.CLAIM_DIAGNOSIS))}
      {TextField('Jumlah Klaim', input.claimAmount, this.handleInputChange.bind(this, FIELD.CLAIM_AMOUNT))}
    </div> : null

    const policySection = input.documentType === 'INSURANCE_POLICY' ? <div>
      <div className='account-page-section-title'>Informasi Polis</div>
      {TextField('Nama Klien', input.policyClientName, this.handleInputChange.bind(this, FIELD.POLICY_CLIENT_NAME))}
      {TextField('Partner Rumah Sakit', input.policyAllowedProviders, this.handleInputChange.bind(this, FIELD.POLICY_ALLOWED_PROVIDERS))}
      {TextField('Cakupan Servis Asuransi ', input.policyAllowedTreatments, this.handleInputChange.bind(this, FIELD.POLICY_ALLOWED_TREAMENTS))}
      {TextField('Syarat dan Ketentuan', input.policyTnC, this.handleInputChange.bind(this, FIELD.POLICY_TNC))}
      {TextField('Maksimum Klaim', input.policyMaxClaims, this.handleInputChange.bind(this, FIELD.POLICY_MAX_CLAIMS))}
    </div> : null

    const createSection = <div>
      <h1>Penerbitan Dokumen Baru</h1>
      {TextField('Kepada', input.documentRecipient, this.handleInputChange.bind(this, FIELD.DOCUMENT_RECIPIENT))}

      <div className='account-page-section-title'>Informasi Umum</div>

      {SelectField('Jenis Dokumen', DOCUMENT_TYPE_HEALTH, input.documentType, this.handleInputChange.bind(this, FIELD.DOCUMENT_TYPE))}
      {TextField('Nomor Dokumen', input.documentNumber, this.handleInputChange.bind(this, FIELD.DOCUMENT_NUMBER))}
      {TextField('Deskripsi Singkat', input.documentShortDescription, this.handleInputChange.bind(this, FIELD.DOCUMENT_SHORT_DESCRIPTION))}
      {DateField('Tanggal Terbit Dokumen', input.documentCreatedAt, this.handleInputChange.bind(this, FIELD.DOCUMENT_CREATED_AT))}
      
      { medicalSection }
      { claimSection }
      { policySection }

      <div className='account-page-section-title'>Informasi Tambahan</div>
      {TextField('Catatan', input.documentAdditionalDescription, this.handleInputChange.bind(this, FIELD.DOCUMENT_ADDITIONAL_DESCRIPTION))}

      <div style={{ marginTop: 36 }}>
        {Checkbox(input.accountAcceptAgreement, <span style={{ fontSize: 18 }}>
          Saya telah membaca ulang untuk memastikan bahwa informasi yang saya masukkan adalah BENAR.
        </span>, this.handleInputChange.bind(this, FIELD.DOCUMENT_ACCEPT_AGREEMENT), 'primary')}
        {Button('Simpan', this.handleSubmitButtonClick, 'primary')}
      </div>
    </div>

    // const ownedDocumentList = this.readOwnedDocumentList()
    // const decipheredDocumentList = this.readDocument(input.accountPrivateKey)
    // const rOwnedDocumentList = this.renderOwnedDocumentList(decipheredDocumentList)

    const invalidPrivateKeyMessage = <div className='document-page-invalid-private-key-message'>
      <img src={notFoundImg} style={{ width: '50%' }} />
      <h1>RSA Private Key tidak ditemukan.</h1><br/>
      Silakan masukkan RSA Private Key Anda pada halaman Profil.
    </div>

    const listSection = this.state.input.accountPrivateKey ? <div>
      <h1>{this.props.title}</h1>
      <div>Your Private Key: </div>
      {/* <div><textarea value={input.accountPrivateKey} onChange={this.handleInputChange.bind(this, FIELD.ACCOUNT_PRIVATE_KEY)} /></div>
      {rOwnedDocumentList} */}
    </div> : invalidPrivateKeyMessage
    // console.log(this.state._getOwnedDocumentListDataKey)
    const documentList = this.readDocument()
    const viewSection = <div>
      {/* <h1>Document #[documentId]</h1> */}
      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Card title='Document1' date='26/09/1997' description='description'></Card>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <Card title='Document2' date='26/09/1997' description='description'></Card>
        </Grid>
      </Grid>
    </div>

    return <div>
      {/* {createSection}{listSection}{viewSection} */}
      {this.props.mode === 'CREATE' && createSection}
      {this.props.mode === 'LIST' && listSection}
      {this.props.mode === 'VIEW' && viewSection}
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
      // const data = decryptRSA(privateKey, cipher)
      // decryptionResult[documentId] = data
      decryptionResult[documentId] = cipher
    })
    // Object.keys(_getDocumentDataKey).forEach(documentId => {
    //   const result = this.props.drizzleState.contracts.Document.document[_getDocumentDataKey[documentId]]
    //   const cipher = result && result.value
    //   const data = decryptRSA(privateKey, cipher)
    //   decryptionResult[documentId] = data
    // })
    return decryptionResult
  }
}

export default DocumentPage