import React from "react"

class LoginInfoBar extends React.Component {
  state = { _getAccountDataKey: null }

  componentDidMount = () => {
    const _getAccountDataKey = this.retrieveAccountData()
    this.setState({ _getAccountDataKey })
  }

  render() {
    const { drizzleState } = this.props
    const accountData = this.readAccountData()
    const accountAddress = drizzleState.accounts[0]

    return <div>
      <p>Anda login sebagai: {accountAddress}</p>
      <p>AccountData yg tersimpan: {JSON.stringify(accountData)}</p>
    </div>
  }

  retrieveAccountData = () => {
    const { drizzle, drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]
    const _getAccountDataKey = drizzle.contracts.Account.methods['account'].cacheCall(accountAddress)
    return _getAccountDataKey
  }

  readAccountData = () => {
    let { _getAccountDataKey } = this.state
    const accountData = this.props.drizzleState.contracts.Account.account[_getAccountDataKey]
    const value = accountData && accountData.value
    return value
  }
}

export default LoginInfoBar