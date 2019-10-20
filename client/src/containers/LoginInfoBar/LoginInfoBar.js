import React from "react"

class LoginInfoBar extends React.Component {
  state = { _getAccountDataKey: null }

  componentDidMount = () => {
    const { drizzle, drizzleState } = this.props
    const contract = drizzle.contracts.Account
    const accountAddress = drizzleState.accounts[0]

    const _getAccountDataKey = contract.methods['accounts'].cacheCall(accountAddress)
    this.setState({ _getAccountDataKey })
  }

  render() {
    let { _getAccountDataKey } = this.state

    const { Account } = this.props.drizzleState.contracts
    const accountData = Account.accounts[_getAccountDataKey]
    const value = accountData && accountData.value

    const { drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]

    return <div>
      <p>Anda login sebagai: {accountAddress}</p>
      <p>AccountData yg tersimpan: {JSON.stringify(value)}</p>
    </div>
  }
}

export default LoginInfoBar