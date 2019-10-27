import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import AccountPage from '../containers/AccountPage'
import HomePage from '../containers/HomePage'
import DocumentPage from '../containers/DocumentPage'
import RequestPage from '../containers/RequestPage'
import NotFoundPage from '../containers/404Page'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>
const _AccountPage = props => () => <AccountPage {...props} />
const _DocumentPage = props => () => <DocumentPage {...props} />
const _RequestPage = props => () => <RequestPage {...props} />
const _HealthPage = props => () => {
  return <DocumentPage {...props} mode='LIST' types={['MEDICAL_RECORD']} />
}
const _InsurancePage = props => () => {
  return <DocumentPage {...props} mode='LIST' types={['INSURANCE_POLICY', 'INSURANCE_CLAIM']} />
}

const getRoutes = drizzleProps => {
  const routes = [
    <Route key='home-page' exact path='/' component={HomePage} />,
    <Route key='account-page' exact path='/account' render={_AccountPage(drizzleProps)} />,
    <Route key='document-page' exact path='/document' render={_DocumentPage(drizzleProps)} />,
    <Route key='access-request-page' exact path='/access' render={_RequestPage(drizzleProps)} />,
    <Route key='health-page' exact path='/health' render={_HealthPage(drizzleProps)} />,
    <Route key='insurance-page' exact path='/insurance' render={_InsurancePage(drizzleProps)} />,
    <Route key='404' path='/404' component={NotFoundPage} />,
    <Redirect from='*' to='/404' />,
  ]
  return routes
}

export {
  getRoutes,
}