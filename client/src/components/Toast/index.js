import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

class Toast extends React.Component {
  render = () => {
    const anchor={ vertical: 'top', horizontal: 'right' }
    const action = <IconButton key='close' aria-label='close' color='primary' onClick={this.handleClose}><CloseIcon /></IconButton>
    return <Snackbar
      anchorOrigin={anchor} open={this.props.visible} onClose={this.handleClose} autoHideDuration={4000} 
      ContentProps={{ 'aria-describedby': 'message-id', style: { background: 'whitesmoke' } }}
      message={<span style={{ fontSize: 14, color: '#284B8C' }}>{this.props.message}</span>} action={[action]} />
  }

  handleClose = () => {
    if (this.props.onClose) this.props.onClose()
  }
}

export default Toast