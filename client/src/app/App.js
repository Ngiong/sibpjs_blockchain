import React from 'react'
import ReadString from '../containers/ReadString'
import LoginInfoBar from '../containers/LoginInfoBar'

import { BrowserRouter as Router } from 'react-router-dom'
import { routes, Menu } from './routes'

import './App.css'

class App extends React.Component {
  state = { drizzleLoading: true, drizzleState: null }

  componentDidMount = () => {
    const { drizzle } = this.props
  
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
  
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState()
  
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ drizzleLoading: false, drizzleState })
      }
    })
  }

  componentWillUnmount = () => this.unsubscribe()

  render = () => {
    let { drizzle } = this.props
    let { drizzleLoading, drizzleState } = this.state

    if (drizzleLoading) return "Loading Drizzle..."
    const drizzleProps = { drizzle, drizzleState }

    return (
      <Router>
        <Menu />
        {routes}
        <div className="App">
          <LoginInfoBar {...drizzleProps} />
          {/* <ReadString {...drizzleProps} /> */}
        </div>
      </Router>
    )
  }
}

export default App