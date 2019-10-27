import React from 'react'

import { DatePicker } from '@material-ui/pickers'

const _onChange = onChange => moment => onChange(moment.format('YYYY-MM-DD'))

export default (label, value, onChange) => {
  return <DatePicker margin="normal" label={label} value={value} format='MMMM Do YYYY' style={{ margin: 0 }}
    onChange={_onChange(onChange)} fullWidth autoOk />
}

