import React from 'react'
import request from 'superagent'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

import accountIcon from './account-icon.png'

const queryToES = () => {
  const url = 'http://localhost:9200/sibpjs/account/_search'
  const body = {
  }
  return request
    .post(url)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(body))
}

class AccountSearch extends React.Component {
  state = {
    accountList: [],
    value: '',
  }

  render = () => {
    const label = this.state.value ? '' : this.props.label
    return <Autocomplete options={this.state.accountList} getOptionLabel={item => item.address} onChange={this.handleOnChange}
      renderInput={params => (<TextField {...params} label={label} margin='normal' fullWidth />) }
      renderOption={item => (<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <img src={accountIcon} style={{ width: 32 }} />
        </div>
        <div style={{ marginLeft: 16 }}>
          <div style={{ fontSize: 16 }}>{item.bpjs} - {item.name}</div>
          <div style={{ fontSize: 12, fontWeight: 500 }}>{item.address}</div>
        </div>
      </div>)} />
  }

  componentDidMount = () => {
    queryToES()
      .then(result => {
        const rs = result.body.hits.hits.map(s => ({
          ...s._source,
          address: s._id
        }))
        this.setState({ accountList: rs })
      })
  }

  handleOnChange = (event, value) => {
    const address = value && value.address || ''
    if (this.props.onChange) this.props.onChange(address)
    this.setState({ value: address })
  }
}

export default AccountSearch