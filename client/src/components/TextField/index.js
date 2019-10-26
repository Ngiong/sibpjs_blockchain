import React from 'react'
import TextField from '@material-ui/core/TextField'

export default (label, onChange) => {
  return <TextField label={label} onChange={onChange} style={{ margin: 0 }} fullWidth />
}