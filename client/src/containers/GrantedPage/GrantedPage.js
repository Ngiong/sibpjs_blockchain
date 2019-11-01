import React from 'react'

import TextField from '../../components/TextField'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import Label from '../../components/Label'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'

class GrantedPage extends React.Component {
    state = {
        input: {
            grantedId: '',
        }
    }

    render = () => {
        const array = ['a', 'b']

        const resultSection = array.length > 0 ? <div>
            <h3>Dokumen yang Anda terima:</h3>
            <div>{JSON.stringify(array)}</div>
        </div> : null

        return <div>
            <h1>Pengajuan Akses Terkabul (Granted)</h1>
            <div>Halaman ini digunakan untuk melihat isi dokumen yang telah diberikan kepada Anda.</div>

            {TextField('Granted ID', this.state.input.grantedId, this.handleInputChange.bind(this, 'grantedId'))}
            {Button('Cek', this.handleSubmitOnClick, 'primary', 'medium')}

            { resultSection }
        </div>
    }

    handleInputChange = (field, event) => {
        const newInput = {...this.state.input}
        newInput[field] = typeof(event) === 'string' ? event : event.target.value
        this.setState({ input: newInput })
    }

    handleSubmitOnClick = () => {

    }
}

export default GrantedPage