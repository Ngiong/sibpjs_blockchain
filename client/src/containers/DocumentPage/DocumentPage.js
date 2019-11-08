import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import DocumentLedger from './ledger'
import {Grid} from '@material-ui/core'
import { decryptRSA } from './rsa'
import './styles.css'

import notFoundImg from './assets/not-found.png'
import documentNotFoundImg from './assets/document-not-found.png'

import AccountSearch from '../../components/AccountSearch'
import Card from '../../components/Card'
import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

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

const COMMON_FIELDS = [FIELD.DOCUMENT_TYPE,FIELD.DOCUMENT_NUMBER,FIELD.DOCUMENT_RECIPIENT,FIELD.DOCUMENT_SHORT_DESCRIPTION, FIELD.DOCUMENT_CREATED_AT, FIELD.DOCUMENT_ADDITIONAL_DESCRIPTION]
const MEDICAL_FIELDS = [...COMMON_FIELDS, FIELD.MEDICAL_SYMPTOMS, FIELD.MEDICAL_DIAGNOSIS, FIELD.MEDICAL_DOCTOR, FIELD.MEDICAL_TREATMENT, FIELD.MEDICAL_PRESCRIPTION]
const CLAIM_FIELDS = [...COMMON_FIELDS, FIELD.CLAIM_HEALTH_PROVIDER_NAME, FIELD.CLAIM_VISIT_DATE, FIELD.CLAIM_DIAGNOSIS, FIELD.CLAIM_AMOUNT]
const POLICY_FIELDS = [...COMMON_FIELDS, FIELD.POLICY_CLIENT_NAME, FIELD.POLICY_ALLOWED_PROVIDERS, FIELD.POLICY_ALLOWED_TREAMENTS, FIELD.POLICY_TNC, FIELD.POLICY_MAX_CLAIMS]

const DOCUMENT_TYPE_HEALTH = {
  MEDICAL_RECORD: 'Rekam Medis',
  INSURANCE_CLAIM: 'Klaim Asuransi',
  INSURANCE_POLICY: 'Polis Asuransi',
}

class DocumentPage extends ReactDrizzleComponent {
  constructor() {
    super()
    this.handleCardOnClick = this.handleCardOnClick.bind(this)
  }

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
    _getDocumentIssuerDataKey: null,
    _getOwnedDocumentListDataKey: null,
    _getDocumentDataKey: {},
    _transactionStackId: null,
    selectedDocumentToView: null,
    showViewDialog: false
  }

  componentDidUpdate = prevProps => {
    this._drizzleStateDidUpdate(prevProps, '_getDocumentRecipientDataKey', 'Account', 'account', this.proceedCreateDocument)
    this._drizzleStateDidUpdate(prevProps, '_getDocumentIssuerDataKey', 'Account', 'account', this.proceedCreateDocument)
    this._drizzleStateDidUpdate(prevProps, '_getOwnedDocumentListDataKey', 'Document', 'getOwnedDocumentList', this.retrieveDocuments)

    this._drizzleStateTxSuccess(prevProps, this.state._transactionStackId, this.handleCompleteCreateDocument)
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
      <AccountSearch label='Kepada' onChange={this.handleInputChange.bind(this, FIELD.DOCUMENT_RECIPIENT)} />

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
        <div style={{ height: '2em' }}/>
        {Button('Simpan', this.handleSubmitButtonClick, 'primary', 'large')}
        <div style={{ height: '2em' }}/>
      </div>
    </div>

    const mockOwnedDocumentList = {"id-1": JSON.stringify({
      "documentId": "id-1",
      "documentType": "MEDICAL_RECORD",
      "documentNumber": "abc",
      "documentRecipient": "",
      "documentShortDescription": "12121",
      "documentCreatedAt": "2019-11-04",
      "documentAdditionalDescription": "",
      "medicalSymptoms": "abc",
      "medicalDiagnosis": "diag",
      "medicalDoctor": "dokter",
      "medicalTreatment": "penanganan",
      "medicalPrescription": "resep",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    }),
    "id-2": JSON.stringify({
      "documentId": "id-2",
      "documentType": "INSURANCE_CLAIM",
      "documentNumber": "abc",
      "documentRecipient": "",
      "documentShortDescription": "def",
      "documentCreatedAt": "2019-11-15",
      "documentAdditionalDescription": "",
      "claimHealthProviderName": "informasi",
      "claimVisitDate": "2019-11-05",
      "claimDiagnosis": "diagnosis",
      "claimAmount": "20000",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    }),
    "id-3": JSON.stringify({
      "documentId": "id-3",
      "documentType": "INSURANCE_POLICY",
      "documentNumber": "12121",
      "documentRecipient": "",
      "documentShortDescription": "ini dokumen",
      "documentCreatedAt": "2019-11-16",
      "documentAdditionalDescription": "",
      "policyClientName": "abc",
      "policyAllowedProviders": "partner",
      "policyAllowedTreatments": "semua",
      "policyTnC": "akwkasa",
      "policyMaxClaims": "3001201021021",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    })}

    const ownedDocumentList = this.readOwnedDocumentList()
    const decipheredDocumentList = this.readDocument(input.accountPrivateKey)
    // const rOwnedDocumentList = this.renderOwnedDocumentList(decipheredDocumentList)
    const rOwnedDocumentList = this.renderOwnedDocumentList(mockOwnedDocumentList)
    const rViewDocument = this.renderViewDocument()

    const invalidPrivateKeyMessage = <div className='document-page-invalid-private-key-message'>
      <img src={notFoundImg} style={{ width: '50%' }} />
      <h1>RSA Private Key tidak ditemukan.</h1><br/>
      Silakan masukkan RSA Private Key Anda pada halaman Profil.
    </div>

    const listSection = this.state.input.accountPrivateKey ? <div>
      <h1>{this.props.title}</h1>
      <div style={{ height: '2em' }} />
      <Grid container spacing={3}>
        {rOwnedDocumentList}
      </Grid>
    </div> : invalidPrivateKeyMessage
    // console.log(this.state._getOwnedDocumentListDataKey)
    const documentList = this.readDocument()
    const viewSection = <div>
      <h1>Document #[documentId]</h1>
    </div>

    const dialogSection = <div>
      { rViewDocument }
    </div>

    return <div className='animated zoomIn faster'>
      { dialogSection }
      {/* {createSection}{listSection}{viewSection} */}
      {this.props.mode === 'CREATE' && createSection}
      {this.props.mode === 'LIST' && listSection}
      {this.props.mode === 'VIEW' && viewSection}
    </div>
  }

  handleInputChange = (field, event) => {
    let newInput = { ...this.state.input }
    newInput[field] = typeof(event) === 'string' || typeof(event) === 'boolean' ? event : event.target.value
    this.setState({ input: newInput })
  }

  handleSubmitButtonClick = () => {
    this.setState({ _getDocumentRecipientDataKey: null, _getDocumentIssuerDataKey: null }, () => {
      const _getDocumentRecipientDataKey = this.retrieveDocumentRecipient(this.state.input.documentRecipient)
      const _getDocumentIssuerDataKey = this.retrieveDocumentIssuer()
      this.setState({ _getDocumentRecipientDataKey, _getDocumentIssuerDataKey }, () => {
        // this might be confusing, ceritanya proceedCreateDocument nya ngeliat dari this.state, shg harus setState dulu.
        const getResult = x => this.props.drizzleState.contracts.Account.account[x]
        if (getResult(_getDocumentRecipientDataKey) && getResult(_getDocumentIssuerDataKey)) this.proceedCreateDocument()
      })
    })
    
  }

  retrieveDocumentRecipient = address => {
    const { drizzle, drizzleState } = this.props
    const ledger = new DocumentLedger(drizzle, drizzleState)
    return ledger.getDocumentRecipientAccountInfo(address)
  }

  retrieveDocumentIssuer = () => {
    const { drizzle, drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]
    const ledger = new DocumentLedger(drizzle, drizzleState)
    return ledger.getDocumentRecipientAccountInfo(accountAddress)
  }

  extractDocumentObject = () => {
    const fields = this.state.input.documentType === 'MEDICAL_RECORD' ? MEDICAL_FIELDS
      : this.state.input.documentType === 'INSURANCE_CLAIM' ? CLAIM_FIELDS : POLICY_FIELDS
    return fields.reduce((dict, fieldName) => ({ ...dict, [fieldName]: this.state.input[fieldName] }), {})
  }

  proceedCreateDocument = () => {
    const { drizzle, drizzleState } = this.props
    const getResult = x => drizzleState.contracts.Account.account[x]
    const { _getDocumentIssuerDataKey, _getDocumentRecipientDataKey } = this.state
    if (!getResult(_getDocumentIssuerDataKey) || !getResult(_getDocumentRecipientDataKey)) return

    const ledger = new DocumentLedger(drizzle, drizzleState)
    const _recipient = drizzleState.contracts.Account.account[this.state._getDocumentRecipientDataKey]
    const recipientAccountData = _recipient && _recipient.value

    const _issuer = drizzleState.contracts.Account.account[this.state._getDocumentIssuerDataKey]
    const issuerAccountData = _issuer && _issuer.value

    const extractedObject = this.extractDocumentObject()
    const _transactionStackId = ledger.createDocument(recipientAccountData, extractedObject, issuerAccountData)
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
    console.log('document list', documentList)
    if (!documentList) return null
    const cardElements = Object.keys(documentList).map((documentId, idx) => {
      console.log('loop', documentId, idx)
      let document = {}
      try {
        console.log('document', document)
        document = JSON.parse(documentList[documentId])
      } catch (err) {
        return null
      }
      if ((this.props.types || []).indexOf(document.documentType) === -1) return null
      return <Grid key={idx} item md={6} sm={12} xs={12}>
        <Card title='Nama RS/Company' documentId={document.documentId} date={document.documentCreatedAt}
              description={document.documentShortDescription} documentType={document.documentType}
              handleOnClick = { this.handleCardOnClick }></Card>
      </Grid>
    }).filter(s => s)
    if (cardElements.length === 0) {
      return <Grid item md={12} sm={12} xs={12}><div style={{ textAlign: 'center' }}>
        <img src={documentNotFoundImg} style={{ width: '50%' }} />
        <h1 style={{ fontWeight: 500 }}>Dokumen Tidak Ditemukan.</h1>
        Anda belum pernah menerima dokumen dengan jenis ini.
        </div></Grid>
    }
    return cardElements.reverse()
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

  handleCompleteCreateDocument = () => {
    window.SHOW_TOAST('Selamat! Dokumen Anda telah berhasil diterbitkan.')
    this.props.history.push('/')
  }

  renderViewDocument = () => {
    const { showViewDialog, selectedDocumentToView } = this.state
    if(selectedDocumentToView != null) {
      return <Dialog open={this.props.showViewDialog} aria-labelledby="form-dialog-title">
        {/* <DialogTitle>Manual Input Private Key</DialogTitle> */}
        <DialogContent>
          <DialogContentText><span className='account-page-section-private-key-dialog'>
            Silakan memasukkan RSA Private Key yang sudah Anda simpan sebelumnya.
          </span></DialogContentText>
          <TextField error={this.state.error} autoFocus margin="dense" label='RSA Private Key' fullWidth multiline
                    onChange={this.handleChange} value={this.state.value} 
                    InputProps={{ style: { fontSize: 12, fontFamily: 'monospace' } }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">Batal</Button>
          <Button onClick={this.handleSubmit} color="primary">Simpan</Button>
        </DialogActions>
      </Dialog>
    } else {
      return <div></div>
    }
  }

  toggleShowDialog = () => {
    this.setState({
      showViewDialog: !this.state.showViewDialog
    })
  }

  handleCardOnClick = documentId => {
    console.log('documentIdabcdef', documentId)
    const { input } = this.state

    const mockOwnedDocumentList = {"id-1": JSON.stringify({
      "documentId": "id-1",
      "documentType": "MEDICAL_RECORD",
      "documentNumber": "abc",
      "documentRecipient": "",
      "documentShortDescription": "12121",
      "documentCreatedAt": "2019-11-04",
      "documentAdditionalDescription": "",
      "medicalSymptoms": "abc",
      "medicalDiagnosis": "diag",
      "medicalDoctor": "dokter",
      "medicalTreatment": "penanganan",
      "medicalPrescription": "resep",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    }),
    "id-2": JSON.stringify({
      "documentId": "id-2",
      "documentType": "INSURANCE_CLAIM",
      "documentNumber": "abc",
      "documentRecipient": "",
      "documentShortDescription": "def",
      "documentCreatedAt": "2019-11-15",
      "documentAdditionalDescription": "",
      "claimHealthProviderName": "informasi",
      "claimVisitDate": "2019-11-05",
      "claimDiagnosis": "diagnosis",
      "claimAmount": "20000",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    }),
    "id-3": JSON.stringify({
      "documentId": "id-3",
      "documentType": "INSURANCE_POLICY",
      "documentNumber": "12121",
      "documentRecipient": "",
      "documentShortDescription": "ini dokumen",
      "documentCreatedAt": "2019-11-16",
      "documentAdditionalDescription": "",
      "policyClientName": "abc",
      "policyAllowedProviders": "partner",
      "policyAllowedTreatments": "semua",
      "policyTnC": "akwkasa",
      "policyMaxClaims": "3001201021021",
      "documentAuthorName": "RS Holland",
      "documentAuthorAddress": "0x3D3b029A9B6Dd5D7ADFd7f653fbf1db8EaAfE506"
    })}

    const ownedDocumentList = this.readOwnedDocumentList()
    // const decipheredDocumentList = this.readDocument(input.accountPrivateKey)
    const decipheredDocumentList = mockOwnedDocumentList
    Object.keys(decipheredDocumentList).map((docId, idx) => {
      console.log('loop', documentId, idx)
      if(docId == documentId) {
        let document = {}
        try {
          console.log('document', document)
          document = JSON.parse(decipheredDocumentList[documentId])
        } catch (err) {
          return null
        }

        this.setState({
          showViewDialog: true,
          selectedDocumentToView: document
        })
      }
    })
  }
}

export default withRouter(DocumentPage)