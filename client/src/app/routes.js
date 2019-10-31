import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import AccountPage from '../containers/AccountPage'
import HomePage from '../containers/HomePage'
import DocumentPage from '../containers/DocumentPage'
import RequestPage from '../containers/RequestPage'
import NotFoundPage from '../containers/404Page'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>
const _AccountPage = props => () => <AccountPage {...props} />
const _DocumentPage = props => () => <DocumentPage {...props} />

const _HealthPage = props => () => {
  return <DocumentPage {...props} mode='LIST' title='Rekam Medis Anda' types={['MEDICAL_RECORD']} />
}
const _InsurancePage = props => () => {
  return <DocumentPage {...props} mode='LIST' title='Dokumen Asuransi Anda' types={['INSURANCE_POLICY', 'INSURANCE_CLAIM']} />
}
const _CreateDocumentPage = props => () => {
  return <DocumentPage {...props} mode='CREATE' />
}

const _RequestPage = props => () => {
  return <RequestPage {...props} mode='REQUEST' />
}
const _GrantAccessPage = props => () => {
  return <RequestPage {...props} mode='GRANT' />
}

const getRoutes = drizzleProps => {
  const routes = [
    <Route key='home-page' exact path='/' component={HomePage} />,
    <Route key='account-page' exact path='/account' render={_AccountPage(drizzleProps)} />,

    <Route key='document-page' exact path='/document' render={_DocumentPage(drizzleProps)} />, // DEBUG PURPOSE ONLY
    <Route key='create-document-page' exact path='/document/create' render={_CreateDocumentPage(drizzleProps)} />,
    <Route key='health-page' exact path='/health' render={_HealthPage(drizzleProps)} />,
    <Route key='insurance-page' exact path='/insurance' render={_InsurancePage(drizzleProps)} />,

    <Route key='request-page' exact path='/request' render={_RequestPage(drizzleProps)} />,
    <Route key='grant-request-page' exact path='/grant' render={_GrantAccessPage(drizzleProps)} />,

    <Route key='404' path='/404' component={NotFoundPage} />,
    <Redirect key='_redirect' to='/404' />,
  ]
  return <Switch>{routes}</Switch>
}

export {
  getRoutes,
}