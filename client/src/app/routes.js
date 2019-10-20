import React from 'react'
import { Route, Link } from 'react-router-dom'

const NotImplemented = () => <div><h2>Not Implemented</h2></div>

const routes = [
  <Route key='home' exact path='/home' component={NotImplemented} />,
  <Route key='about' exact path='/about' component={NotImplemented} />,
  <Route key='dashboard' exact path='/dashboard' component={NotImplemented} />,
]

class Menu extends React.Component {
  render = () => {
    return <div>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </div>
  }
}

export {
  Menu,
  routes,
}