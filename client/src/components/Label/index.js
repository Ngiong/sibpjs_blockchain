import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'

export default (label, shrink=true) => {
  return <InputLabel shrink={shrink}>{label}</InputLabel>
}