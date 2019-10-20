import React from "react"

class ReadString extends React.Component {
  state = { dataKey2: null }

  componentDidMount() {
    const { drizzle, drizzleState } = this.props
    const contract2 = drizzle.contracts.Account

    const dataKey2 = contract2.methods['accounts'].cacheCall('0x1898C85C2Ad7F3Ba1073a6Ca5a3323Ea6cDEFFf6')
    this.setState({ dataKey2 })

    console.log(drizzle)
    console.log(drizzleState)
  }

  render() {
    // get the contract state from drizzleState
    const { Account } = this.props.drizzleState.contracts

    // using the saved `dataKey`, get the variable we're interested in
    const account = Account.accounts[this.state.dataKey2]

    // if it exists, then we display its value
    return <p>My stored string: {JSON.stringify(account && account.value)}</p>
  }
}

export default ReadString