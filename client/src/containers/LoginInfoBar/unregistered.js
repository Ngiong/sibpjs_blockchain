import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Unregistered extends React.Component {
  render = () => {
    const defaultMessage = 'Anda belum terdaftar pada sistem SiBPJS. Silakan menuju halaman Profil untuk mengisi data diri Anda.'
    return <Dialog open={this.props.visible} TransitionComponent={Transition} keepMounted>
      <DialogTitle>Informasi Akun Tidak Ditemukan</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { this.props.message || defaultMessage }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.props.onRedirect} color="primary">
          Arahkan Saya!
        </Button>
      </DialogActions>
      </Dialog>
  }
}

export default Unregistered