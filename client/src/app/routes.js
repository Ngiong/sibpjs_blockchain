import React from 'react'
import { Redirect, Route, Link } from 'react-router-dom'

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
    <Route key='access-request-page' exact path='/access' render={_RequestPage(drizzleProps)} />,
    <Redirect key='default-page' from="/" to="/document" />,
  ]
  return routes
}

export {
  getRoutes,
}