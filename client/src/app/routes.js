import React from 'react'
import { Route, Link } from 'react-router-dom'

import AccountPage from '../containers/AccountPage'
import DocumentPage from '../containers/DocumentPage'
import RequestPage from '../containers/RequestPage'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>
const _AccountPage = props => () => <AccountPage {...props} />
const _DocumentPage = props => () => <DocumentPage {...props} />
const _RequestPage = props => () => <RequestPage {...props} />

const getRoutes = drizzleProps => {
  const routes = [
    <Route key='account-page' exact path='/account' render={_AccountPage(drizzleProps)} />,
    <Route key='document-page' exact path='/document' render={_DocumentPage(drizzleProps)} />,
    <Route key='request-page' exact path='/request' render={_RequestPage(drizzleProps)} />,
  ]
  return routes
}

class Menu extends React.Component {
  render = () => {
    return <div style={{ textAlign: 'center' }}>
      <h1>Menu</h1>
      <ul>
        <li><Link to="/account">Account Page</Link></li>
        <li><Link to="/document">Document Page</Link></li>
        <li><Link to="/request">Request Page</Link></li>
      </ul>
    </div>
  }
}

export {
  Menu,
  getRoutes,
}