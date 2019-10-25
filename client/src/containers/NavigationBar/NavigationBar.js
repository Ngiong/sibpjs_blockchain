import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

class NavigationItem extends React.Component {
  render = () => {
    return <div>

    </div>
  }
}

class NavigationBar extends React.Component {
  render = () => {
    // return <div className='navigation-bar-menu'>
    // </div>
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

export default NavigationBar