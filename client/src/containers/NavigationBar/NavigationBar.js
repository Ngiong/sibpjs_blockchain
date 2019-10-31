import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

import healthIcon from './assets/health.png'
import insuranceIcon from './assets/insurance.png'
import accessIcon from './assets/access.png'
import documentIcon from './assets/document.png'
import grantedIcon from './assets/granted.png'

class NavigationItem extends React.Component {
  render = () => {
    const img = this.props.type === 'HEALTH' ? healthIcon
      : this.props.type === 'INSURANCE' ? insuranceIcon
      : this.props.type === 'CREATE_DOCUMENT' ? documentIcon 
      : this.props.type === 'GRANTED' ? grantedIcon : accessIcon

    const label = this.props.type === 'HEALTH' ? 'Rekam Medis'
    : this.props.type === 'INSURANCE' ? 'Asuransi'
    : this.props.type === 'CREATE_DOCUMENT' ? 'Dokumen'
    : this.props.type === 'GRANTED' ? 'Granted' : 'Akses'

    let itemClass = 'navigation-bar-menu-item'

    return <div className='navigation-bar-menu-item-wrapper'>
      <NavLink to={this.props.link} activeClassName='navigation-bar-menu-item-active'>
        <div className={itemClass}>
          <img src={img} className='navigation-bar-menu-item-icon' />
          <span className='navigation-bar-menu-item-label'>{label}</span>
        </div>
      </NavLink>
    </div>
  }

  handleOnClick = () => {
    if (this.props.onClick) this.props.onClick(this.props.type)
  }
}

class NavigationBar extends React.Component {
  state = {
    _getAccountDataKey: null,
  }

  componentDidMount = () => {
    const _getAccountDataKey = this.retrieveAccountData()
    this.setState({ _getAccountDataKey })
  }

  render = () => {
    const { drizzleState } = this.props
    const accountData = this.readAccountData()

    const regularNavigation = [
      <NavigationItem key='health' type='HEALTH' link='/health' />,
      <NavigationItem key='insurance' type='INSURANCE' link='/insurance' />,
      <NavigationItem key='access' type='ACCESS' link='/grant' />,
    ]

    const nonRegularNavigation = [
      <NavigationItem key='document' type='CREATE_DOCUMENT' link='/document/create' />,
      <NavigationItem key='granted' type='GRANTED' link='/granted' />,
      <NavigationItem key='access' type='ACCESS' link='/request' />,
    ]

    return <div className='navigation-bar-menu'>
      { accountData && accountData.accountType === 'REGULAR' && regularNavigation }
      { accountData && ['HEALTH_PROVIDER', 'INSURANCE_COMPANY'].indexOf(accountData.accountType) !== -1 && nonRegularNavigation }
    </div>
    // return <div style={{ textAlign: 'center' }}>
    //   <h1>Menu</h1>
    //   <ul>
    //     <li><Link to="/account">Account Page</Link></li>
    //     <li><Link to="/document">Document Page</Link></li>
    //     <li><Link to="/request">Request Page</Link></li>
    //   </ul>
    // </div>
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

export default NavigationBar