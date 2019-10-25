import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

import menuIcon from './assets/menu-icon.png'
import profileImg from './assets/profile-image.png'

class LoginInfoBar extends React.Component {
  state = {
    sidebarOpened: false,
    _getAccountDataKey: null,
  }

  componentDidMount = () => {
    const _getAccountDataKey = this.retrieveAccountData()
    this.setState({ _getAccountDataKey })
  }

  render() {
    const { drizzleState } = this.props
    const accountData = this.readAccountData()
    const accountAddress = drizzleState.accounts[0]

    let navbar = <div className='login-info-bar-navbar'>
      <img src={menuIcon} className='login-info-bar-navbar-menu-icon'
           onClick={this.toggleSidebarOpen} />
    </div>

    let profile = this.state.sidebarOpened ? <div className='login-info-bar-profile'>
      <img src={profileImg} className='login-info-bar-profile-image' />
      <div className='login-info-bar-profile-accountName'>{accountData.accountName || 'User-100001'}</div>
      <div className='login-info-bar-profile-accountAddress'>Address: {accountAddress}</div>
    </div> : null

    let navigation = this.state.sidebarOpened ? <div className='login-info-bar-navigation'>
      <Link to="/account"><div onClick={this.toggleSidebarOpen}>Ubah Profil</div></Link>
      <p>(cuma buat debug) AccountData yg tersimpan: {JSON.stringify(accountData)}</p>
    </div> : null

    let sidebar = this.state.sidebarOpened ? <div>
      <div className='login-info-bar-sidebar'>
        { profile }
        { navigation }
      </div>
      <div className='login-info-bar-sidebar-overlay'
           onClick={this.toggleSidebarOpen} />
    </div> : null

    return <div className='login-info-bar'>
      { navbar }
      { sidebar }
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
}

export default LoginInfoBar