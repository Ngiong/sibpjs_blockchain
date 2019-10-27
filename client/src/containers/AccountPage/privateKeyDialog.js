import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { checkRSAKeyPair } from './rsa'

class PrivateKeyDialog extends React.Component {
  state = {
    value: '',
    error: false,
  }

  render = () => {
    return <Dialog open={this.props.visible} aria-labelledby="form-dialog-title">
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
  }

  handleChange = event => {
    const value = event.target.value
    const error = !checkRSAKeyPair(value, this.props.publicKey)
    this.setState({ value, error })
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.value)
    this.props.onClose()
  }
}

export default PrivateKeyDialog
