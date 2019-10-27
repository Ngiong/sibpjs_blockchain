import React from 'react'
import { Redirect, Route, Link } from 'react-router-dom'

import AccountPage from '../containers/AccountPage'
import HomePage from '../containers/HomePage'
import DocumentPage from '../containers/DocumentPage'
import RequestPage from '../containers/RequestPage'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>
const _AccountPage = props => () => <AccountPage {...props} />
const _DocumentPage = props => () => <DocumentPage {...props} />
const _RequestPage = props => () => <RequestPage {...props} />

const getRoutes = drizzleProps => {
  const routes = [
    <Route key='home-page' exact path='/' component={HomePage} />,
    <Route key='account-page' exact path='/account' render={_AccountPage(drizzleProps)} />,
    <Route key='document-page' exact path='/document' render={_DocumentPage(drizzleProps)} />,
    <Route key='access-request-page' exact path='/access' render={_RequestPage(drizzleProps)} />,
  ]
  return routes
}

export {
  getRoutes,
}