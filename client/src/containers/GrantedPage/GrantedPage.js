import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import DocumentLedger from './ledger'
import { decryptRSA } from './rsa'
import {Grid} from '@material-ui/core'

import documentNotFoundImg from './assets/document-not-found.png'

import Activity from '../../components/Activity'
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
import DialogTitle from '@material-ui/core/DialogTitle'
import MaterialTextField from '@material-ui/core/TextField'
import { DatePicker } from '@material-ui/pickers'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import InsuranceClaimView from './InsuranceClaimView'
import MedicalRecordView from './MedicalRecordView'
import InsurancePolicyView from './InsurancePolicyView'

class GrantedPage extends ReactDrizzleComponent {
    constructor() {
        super()
        this.handleCardOnClick = this.handleCardOnClick.bind(this)
        // this.handleCloseDialog = this.handleCloseDialog.bind(this)
    }

    state = {
        input: {
            grantedId: '',
            accountPrivateKey: '',
        },
        showGrantedActivity: false,
        _getAuthorizedDocumentDataKey: null,
        selectedDocumentToView: null,
        showViewDialog: false
    }

    componentDidMount = () => {
        const accountAddress = this.props.drizzleState.accounts[0]
        const _accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress)
        if (_accountPrivateKey) this.handleInputChange('accountPrivateKey', _accountPrivateKey)
    }

    render = () => {
        const authDocumentData = this.readAuthorizedDocument(this.state.input.accountPrivateKey)          
        const resultSection = this.renderResultSection(authDocumentData)
        const rViewDocument = this.renderViewDocument()

        return <div className='animated zoomIn faster'>
            <h1>Pengajuan Akses Terkabul (Granted)</h1>
            <div>Halaman ini digunakan untuk melihat isi dokumen yang telah diberikan kepada Anda.</div>

            <div style={{ height: '2em' }}/>
            {TextField('Granted ID', this.state.input.grantedId, this.handleInputChange.bind(this, 'grantedId'))}
            <div style={{ height: '1em' }}/>
            {Button('Cek', this.handleSubmitOnClick, 'primary', 'medium', !this.state.input.grantedId)}

            {Activity(this.state.showGrantedActivity, 'Granted ID #' + this.state.input.grantedId, resultSection, () => this.setState({ showGrantedActivity: false }) )}

            {rViewDocument}
        </div>
    }

    handleInputChange = (field, event) => {
        const newInput = { ...this.state.input }
        newInput[field] = typeof (event) === 'string' ? event : event.target.value
        this.setState({ input: newInput })
    }

    handleSubmitOnClick = () => {
        const { drizzle, drizzleState } = this.props
        const ledger = new DocumentLedger(drizzle, drizzleState)
        const _getAuthorizedDocumentDataKey = ledger.getAuthorizedDocumentById(this.state.input.grantedId)
        this.setState({ _getAuthorizedDocumentDataKey, showGrantedActivity: true })
    }

    readAuthorizedDocument = privateKey => {
        const { _getAuthorizedDocumentDataKey } = this.state
        const result = this.props.drizzleState.contracts.Document.authorizedDocumentData[_getAuthorizedDocumentDataKey]
        const authDocumentData = result && result.value
        if (!authDocumentData) return {}

        return {
            id: authDocumentData.id,
            documentOwner: authDocumentData.documentOwner,
            documentDataList: decryptRSA(privateKey, authDocumentData.documentDataList)
        }
    }

    renderResultSection = authDocumentData => {
        console.log('authDocumentData', authDocumentData, authDocumentData.documentDataList)
        if (!authDocumentData) return null
        if (authDocumentData.documentDataList === '') return <div style={{ textAlign: 'center', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img src={documentNotFoundImg} style={{ width: '50%' }} />
            <h1 style={{ fontWeight: 500 }}>Dokumen Tidak Ditemukan</h1>
            <div style={{ fontSize: 18 }}>Pastikan Anda telah memasukkan Granted ID dengan benar.</div>
        </div>
        let documentList = []
        try {
            documentList = JSON.parse(authDocumentData.documentDataList)
        } catch (err) {
            return null
        }

        const cardElements = documentList.map((document, idx) => {
            return <Grid key={idx} item md={6} sm={12} xs={12}>
                <Card title={document.documentAuthorName} documentId={document.documentId} date={document.documentCreatedAt}
                    description={document.documentShortDescription} documentType={document.documentType}
                    handleOnClick = { this.handleCardOnClick }></Card>
            </Grid>
        })
        
        return <div>
            <h1>Rincian dokumen yang Anda terima:</h1>
            <h2><div style={{ fontSize: 20, fontWeight: 500 }}>Pemilik Dokumen:</div> {authDocumentData.documentOwner}</h2>
            <Grid container spacing={3}>{cardElements}</Grid>
        </div>
        // const cardElements = Object.keys(documentList).map((documentId, idx) => {
        // let document = {}
        // try {
        //     document = JSON.parse(documentList[documentId])
        // } catch (err) {
        //     return null
        // }
        // if ((this.props.types || []).indexOf(document.documentType) === -1) return null
        // return <Grid key={idx} item md={6} sm={12} xs={12}>
        //     <Card title='Nama RS/Company' documentId={documentId} date='{documentCreatedAt}'
        //         description='{documentShortDescription}' documentType='{documentType}'></Card>
        // </Grid>
        // }).filter(s => s)
        // if (cardElements.length === 0) {
        // return <Grid item md={12} sm={12} xs={12}><div style={{ textAlign: 'center' }}>
        //     <img src={documentNotFoundImg} style={{ width: '50%' }} />
        //     <h1 style={{ fontWeight: 500 }}>Dokumen Tidak Ditemukan.</h1>
        //     Anda belum pernah menerima dokumen dengan jenis ini.
        //     </div></Grid>
        // }
        // return cardElements
    }

    renderViewDocument = () => {
        const { showViewDialog, selectedDocumentToView } = this.state
        if(selectedDocumentToView != null) {
          console.log('selectedDocumentToView', selectedDocumentToView)
          const documentType = selectedDocumentToView.documentType
          let detailFields = (<div></div>)
    
          if(documentType == 'MEDICAL_RECORD') {
            detailFields = (
              <MedicalRecordView 
                data = { selectedDocumentToView }
              />
            )
          } else if(documentType == 'INSURANCE_CLAIM') {
            detailFields = (
              <InsuranceClaimView 
                data = { selectedDocumentToView }
              />
            )
          } else if(documentType == 'INSURANCE_POLICY') {
            detailFields = (
              <InsurancePolicyView
                data = { selectedDocumentToView }
              />
            )
          }
          return <Dialog open={showViewDialog} onClose = { this.handleCloseDialog }  aria-labelledby="form-dialog-title">
            <DialogTitle>
              #{selectedDocumentToView.documentId} - {selectedDocumentToView.documentNumber}
              <IconButton aria-label="close" style = {{float:'right', color:'red'}} onClick={this.handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <MaterialTextField 
                label="Description"
                value= {selectedDocumentToView.documentShortDescription}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
    
              <DatePicker margin="normal" 
                label="Created At" 
                value= {selectedDocumentToView.createdAt} 
                format='MMMM Do YYYY' 
                InputProps={{
                  readOnly: true,
                }}
                fullWidth />
              
              { detailFields }
    
    
            </DialogContent>
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
    
      handleCloseDialog = () => {
        this.setState({
          showViewDialog: false
        })
      }
    
      handleCardOnClick = documentId => {
        console.log('documentIdabcdef', documentId)
        const { input } = this.state
        const authDocumentData = this.readAuthorizedDocument(this.state.input.accountPrivateKey)          
        let list = JSON.parse(authDocumentData.documentDataList)
        list.forEach((document, idx) => {
            console.log('loop', document, idx, document.documentId)
            if(document.documentId == documentId) {
                console.log('sama')
            // let document = {}
            // try {
            //   console.log('document', document)
            //   document = JSON.parse(authDocumentData.documentDataList[idx])
            // } catch (err) {
            //   return null
            // }

                this.setState({
                    showViewDialog: true,
                    selectedDocumentToView: document
                })
            }
        })
    }

}

export default GrantedPage