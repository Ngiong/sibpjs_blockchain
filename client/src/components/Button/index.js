import React from 'react'
import Button from '@material-ui/core/Button'

export default (label, onClick, color='primary', size='small', disabled=false, variant='contained') => {
  return <Button variant={variant} color={color} onClick={onClick} disabled={disabled} size={size} fullWidth>{label}</Button>
}