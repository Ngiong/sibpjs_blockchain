import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const _onChange = onChange => event => onChange(event.target.checked)

export default (checked, label, onChange, color='secondary', placement='right') => {
  return <FormControlLabel labelPlacement={placement} label={label} checked={checked} onChange={_onChange(onChange)}
    control={<Checkbox color={color} />}
  />
}