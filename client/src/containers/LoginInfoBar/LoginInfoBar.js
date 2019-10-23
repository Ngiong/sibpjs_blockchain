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
    return drizzle.contracts.Account.methods['account'].cacheCall(accountAddress)
  }

  readAccountData = () => {
    let { _getAccountDataKey } = this.state
    const accountData = this.props.drizzleState.contracts.Account.account[_getAccountDataKey]
    return accountData && accountData.value
  }
}

export default LoginInfoBar