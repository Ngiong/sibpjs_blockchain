import React from 'react'
import LoginInfoBar from '../containers/LoginInfoBar'

import { BrowserRouter as Router } from 'react-router-dom'
import { getRoutes } from './routes'

import NavigationBar from '../containers/NavigationBar'

import MomentUtils from '@date-io/moment'
import { MuiThemeProvider } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { createMuiTheme } from '@material-ui/core/styles'
import './App.css'

const muiTheme = createMuiTheme({
  typography: {
    fontFamily: '\"Do Hyeon\", \"Ubuntu\"',
    fontSize: 18
  }
})

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

    const routes = getRoutes(drizzleProps)

    return (
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router>
            <LoginInfoBar {...drizzleProps} />
            <div style={{ maxWidth: 500, padding: '0 20px', 
                margin: 'auto', marginBottom: 100 }}>{routes}</div>
            <NavigationBar />
          </Router>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    )
  }
}

export default App