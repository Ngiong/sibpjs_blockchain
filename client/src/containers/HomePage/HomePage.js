import React from 'react'
import './styles.css'

import siBPJSImage from './assets/sibpjs.png'

class HomePage extends React.Component {
  render = () => {
    return <div className='home-page-container'>
      <div className='home-page-welcome'>Selamat datang di</div>
      <img src={siBPJSImage} className='home-page-logo' />
    </div>
  }
}

export default HomePage