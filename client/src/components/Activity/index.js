import React from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export default (showed, title, content, onBack) => {
    if (!showed) return null

    const activityStyle = {
        height: '100%',
        width: '600px',
        display: 'flex',
    }

    const wrapperStyle = {
        position: 'fixed',
        left: 0, right: 0, top: 0, bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
    }

    const contentStyle = {
        width: '100%',
        padding: '64px 20px 0px',
        background: 'white'
    }

    return <div style={wrapperStyle}>
        <div style={activityStyle} className='animated fadeInUpBig fast'>
            <div className='login-info-bar-navbar'>
                <div className='login-info-bar-navbar-menu-icon' onClick={onBack}><ArrowBackIcon  style={{ color: 'white' }} /></div>
                <div style={{ fontSize: 24, color: 'white', position: 'absolute', left: 50, right: 50, textAlign: 'center' }}>{title}</div>
            </div>
            <div style={contentStyle}>{content}</div>
        </div>
    </div>
}