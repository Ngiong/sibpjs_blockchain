import React from 'react'
import TextField from '@material-ui/core/TextField'

const _onChange = onChange => event => onChange(event.target.value)

export default (label, value, onChange) => {
  return <TextField label={label} onChange={_onChange(onChange)} value={value} style={{ margin: 0 }} fullWidth />
}