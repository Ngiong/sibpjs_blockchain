import React from 'react'

class ReactDrizzleComponent extends React.Component {
  _drizzleStateDidUpdate = (prevProps, dataKeyName, contractName, methodName, callback) => {
    const _key = this.state[dataKeyName]
    if (_key) {
      const newState = this.props.drizzleState.contracts[contractName][methodName][_key]
      const prevState = prevProps.drizzleState.contracts[contractName][methodName][_key]
      if (JSON.stringify(newState) !== JSON.stringify(prevState)) {
        const result = this.props.drizzleState.contracts[contractName][methodName][_key]
        callback(result && result.value)
      }
    }
  }

  _drizzleStateIfExist = (dataKey, contractName, methodName, callback) => {
    const result = this.props.drizzleState.contracts[contractName][methodName][dataKey]
    if (result) callback(result.value)
  }

  _drizzleStateTxSuccess = (prevProps, txStackId, successCallback) => {
    if (txStackId === null) return

    const txHash = this.props.drizzleState.transactionStack[txStackId]
    if (!txHash) return

    const newState = this.props.drizzleState.transactions[txHash]
    const prevState = prevProps.drizzleState.transactions[txHash]

    if (JSON.stringify(newState) !== JSON.stringify(prevState)) {
      const tx = this.props.drizzleState.transactions[txHash]
      if (!tx) return
      if (tx.status === 'success') successCallback()
    }
  }
}

export default ReactDrizzleComponent