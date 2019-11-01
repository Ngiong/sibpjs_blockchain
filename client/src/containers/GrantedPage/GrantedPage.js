import React from 'react'
import ReactDrizzleComponent from '../_common/ReactDrizzleComponent'
import DocumentLedger from './ledger'
import { decryptRSA } from './rsa'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

class GrantedPage extends ReactDrizzleComponent {
    state = {
        input: {
            grantedId: '',
            accountPrivateKey: '',
        },
        _getAuthorizedDocumentDataKey: null,
    }

    componentDidMount = () => {
        const accountAddress = this.props.drizzleState.accounts[0]
        const _accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress)
        if (_accountPrivateKey) this.handleInputChange('accountPrivateKey', _accountPrivateKey)
    }

    render = () => {
        const array = ['a', 'b']
        const authDocumentData = this.readAuthorizedDocument(this.state.input.accountPrivateKey)

        const resultSection = array.length > 0 ? <div>
            <h3>Rincian dokumen yang Anda terima:</h3>
            <div>{JSON.stringify(authDocumentData)}</div>
        </div> : null

        return <div>
            <h1>Pengajuan Akses Terkabul (Granted)</h1>
            <div>Halaman ini digunakan untuk melihat isi dokumen yang telah diberikan kepada Anda.</div>

            {TextField('Granted ID', this.state.input.grantedId, this.handleInputChange.bind(this, 'grantedId'))}
            {Button('Cek', this.handleSubmitOnClick, 'primary', 'medium', !this.state.input.grantedId)}

            {resultSection}
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
        this.setState({ _getAuthorizedDocumentDataKey })
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

}

export default GrantedPage