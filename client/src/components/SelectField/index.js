import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';

import TextField from '@material-ui/core/TextField'

class SelectField extends React.Component {
  state = { dialog: false }

  render = () => {
    const listItems = Object.keys(this.props.options).map(key => {
      return <ListItem button onClick={() => this.handleOnClick(key)} key={key}>
        <ListItemText primary={this.props.options[key]} />
      </ListItem>
    })

    const _value = this.props.value ? this.props.options[this.props.value] : ''

    return <div>
      <TextField label={this.props.label} value={_value} style={{ margin: 0 }} fullWidth
                 onClick={this.handleTextFieldOnClick} InputProps={{readOnly: true}} margin='dense'  />
      <Dialog open={this.state.dialog} onClose={this.handleOnClose}> 
        <List>{listItems}</List>
      </Dialog>
    </div>
  }

  handleTextFieldOnClick = () => {
    this.setState({ dialog: true })
  }

  handleOnClick = value => {
    if (this.props.onClick) this.props.onClick(value)
    this.setState({ dialog: false }) 
  }

  handleOnClose = () => {
    if (this.props.onClose) this.props.onClose()
    this.setState({ dialog: false })
  }
}

export default (label, options, value, onClick, onClose) => {
  return <SelectField label={label} options={options} value={value} onClick={onClick} onClose={onClose} />
}