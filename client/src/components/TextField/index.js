import React from 'react'
import TextField from '@material-ui/core/TextField'

const _onChange = onChange => moment => {
  onChange(moment.format('YYYY-MM-DD'))
}

export default (label, onChange) => {
  return <TextField label={label} onChange={_onChange(onChange)} style={{ margin: 0 }} fullWidth />
}