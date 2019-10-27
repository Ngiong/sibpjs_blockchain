import React from 'react'
import notFoundImg from './assets/not-found.png'

class NotFoundPage extends React.Component {
  render = () => {
    return <div className='document-page-invalid-private-key-message' style={{ height: '70vh', overflowY: 'hidden' }}>
      <img src={notFoundImg} style={{ width: '50%' }} />
      <h1 style={{ fontWeight: 500 }}>Oh no!!<br/> 404 Not Found.</h1><br/>
      Halaman yang Anda tuju tidak tersedia.<br/>
      Jangan putus asa, karena Anda masih dapat memilih menu yang tersedia di bawah ini.
    </div>
  }
}

export default NotFoundPage