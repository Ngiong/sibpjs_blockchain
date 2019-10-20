import React from 'react'
import ReadString from '../containers/ReadString'

import { BrowserRouter as Router } from 'react-router-dom'
import { routes, Menu } from './routes'

import './App.css'

class App extends React.Component {
  constructor() {
    super()
    this.state = { loading: true, drizzleState: null } 
  }

  componentDidMount() {
    const { drizzle } = this.props
  
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
  
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState()
  
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState })
      }
    })
  }

  componentWillUnmount() { this.unsubscribe() }

  render() {
    if (this.state.loading) return "Loading Drizzle..."
    return (
      <Router>
        <Menu />
        {routes}
        <div className="App">
          <ReadString
            drizzle={this.props.drizzle}
            drizzleState={this.state.drizzleState}
          />
        </div>
      </Router>
    )
  }
}

export default App