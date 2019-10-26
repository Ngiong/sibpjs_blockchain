import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

import healthIcon from './assets/health.png'
import insuranceIcon from './assets/insurance.png'
import accessIcon from './assets/access.png'

class NavigationItem extends React.Component {
  render = () => {
    const img = this.props.type === 'HEALTH' ? healthIcon
      : this.props.type === 'INSURANCE' ? insuranceIcon : accessIcon

    const label = this.props.type === 'HEALTH' ? 'Rekam Medis'
    : this.props.type === 'INSURANCE' ? 'Asuransi' : 'Akses'

    let itemClass = 'navigation-bar-menu-item'

    const activeLine = this.props.active ? <hr className='navigation-bar-menu-item-active-line' /> : null

    return <NavLink to={this.props.link} activeClassName='navigation-bar-menu-item-active'>
      <div className={itemClass}>
        <img src={img} className='navigation-bar-menu-item-icon' />
        <span className='navigation-bar-menu-item-label'>{label}</span>
      </div>
    </NavLink>
  }

  handleOnClick = () => {
    if (this.props.onClick) this.props.onClick(this.props.type)
  }
}

class NavigationBar extends React.Component {

  render = () => {
    return <div className='navigation-bar-menu'>
      <NavigationItem type='HEALTH' link='/health' />
      <NavigationItem type='INSURANCE' link='/insurance' />
      <NavigationItem type='ACCESS' link='/access' />
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
}

export default NavigationBar