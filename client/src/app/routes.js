import React from 'react'
import { Route, Link } from 'react-router-dom'

import AccountPage from '../containers/AccountPage'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>
const _AccountPage = props => () => <AccountPage {...props} />

const getRoutes = drizzleProps => {
  const routes = [
    <Route key='home' exact path='/home' component={NotImplemented} />,
    <Route key='about' exact path='/about' component={NotImplemented} />,
    <Route key='dashboard' exact path='/dashboard' component={NotImplemented} />,
    <Route key='account-page' exact path='/account' render={_AccountPage(drizzleProps)} />,
  ]
  return routes
}

class Menu extends React.Component {
  render = () => {
    return <div>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/account">Account Page</Link></li>
      </ul>
    </div>
  }
}

export {
  Menu,
  getRoutes,
}