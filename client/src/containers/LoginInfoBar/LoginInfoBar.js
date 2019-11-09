import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './styles.css'

import Unregistered from './unregistered'

import menuIcon from './assets/menu-icon.png'
import profileImg from './assets/profile-image.png'
import homeIcon from './assets/home-icon.png'
import profileIcon from './assets/account-icon.png'

class LoginInfoBar extends React.Component {
  state = {
    sidebarOpened: false,
    unregisteredDialogOpened: false,
    unregisteredDialogMessage: '',
    _getAccountDataKey: null,
  }

  componentDidMount = () => {
    const _getAccountDataKey = this.retrieveAccountData()
    this.setState({ _getAccountDataKey })

    const accountAddress = this.props.drizzleState.accounts[0]
    const accountPrivateKey = localStorage.getItem('accountPrivateKey#' + accountAddress) || ''
    if (accountPrivateKey === '' && this.props.location.pathname !== '/account') this.setState({
      unregisteredDialogOpened: true,
    })
  }

  render() {
    const { drizzleState } = this.props
    const accountData = this.readAccountData()
    const accountAddress = drizzleState.accounts[0]

    let unregisteredDialogOpened = this.state.unregisteredDialogOpened
    if (accountData && !accountData.accountPublicKey) unregisteredDialogOpened = true
    if (this.props.location.pathname === '/account') unregisteredDialogOpened = false

    let navbar = <div className='login-info-bar-navbar'>
      <img src={menuIcon} className='login-info-bar-navbar-menu-icon'
           onClick={this.toggleSidebarOpen} />
    </div>

    let profile = this.state.sidebarOpened ? <div className='login-info-bar-profile'>
      <img src={profileImg} className='login-info-bar-profile-image' />
      <div className='login-info-bar-profile-accountName'>{accountData && accountData.accountName}</div>
      <div className='login-info-bar-profile-accountAddress'>Address: {accountAddress}</div>
    </div> : null

    let navigation = this.state.sidebarOpened ? <div className='login-info-bar-navigation'>
      <Link to='/'><div onClick={this.toggleSidebarOpen} className='login-info-bar-navigation-item'>
        <img src={homeIcon} className='login-info-bar-navigation-item-icon' /> Home</div></Link>
      <Link to='/account'><div onClick={this.toggleSidebarOpen} className='login-info-bar-navigation-item'>
        <img src={profileIcon} className='login-info-bar-navigation-item-icon' /> Profil</div></Link>
    </div> : null

    let sidebar = this.state.sidebarOpened ? <div>
      <div className='login-info-bar-sidebar-overlay'
         onClick={this.toggleSidebarOpen} />
      <div className='login-info-bar-sidebar animated slideInLeft faster'>
        { profile }
        { navigation }
      </div>
    </div> : null

    return <div className='login-info-bar'>
      { navbar }
      { sidebar }
      <Unregistered visible={unregisteredDialogOpened} message={this.state.unregisteredDialogMessage} onRedirect={this.handleRedirect} />
    </div>
  }

  toggleSidebarOpen = () => {
    const sidebarOpened = this.state.sidebarOpened
    this.setState({ sidebarOpened: !sidebarOpened })
  }

  retrieveAccountData = () => {
    const { drizzle, drizzleState } = this.props
    const accountAddress = drizzleState.accounts[0]
    return drizzle.contracts.Account.methods['account'].cacheCall(accountAddress)
  }

  readAccountData = () => {
    let { _getAccountDataKey } = this.state
    const accountData = this.props.drizzleState.contracts.Account.account[_getAccountDataKey]
    return accountData && accountData.value
  }

  handleRedirect = () => {
    this.setState({ unregisteredDialogOpened: false })
    this.props.history.push('/account')
  }
}

export default withRouter(LoginInfoBar)