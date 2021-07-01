import React from 'react'
import { useHistory, useLocation } from 'react-router'
import '../Landing/Landing.css'
import logo from '../../assets/logo.svg'

const Header = () => {
  const history = useHistory()
  const location = useLocation()

  const handleClick = () => {
    window.localStorage.clear()
    history.push('/')
  }
  return (
    <div className='header'>
      <a href='/' style={{ display: 'flex' }}>
        <img src={logo} alt='logo' className='logo' />
        <h1 className='title'>Mercury Mailer</h1>
      </a>
      {
        (window.localStorage.getItem('token') !== null && window.localStorage.getItem('token') !== undefined) &&
        (location.pathname !== '/' && location.pathname !== '/login') &&
          <div onClick={handleClick} className='logout'>Logout</div>
      }
    </div>
  )
}

export default Header
