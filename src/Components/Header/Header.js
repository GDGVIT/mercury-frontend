import React from 'react'
import '../Landing/Landing.css'
import logo from '../../assets/logo.svg'

const Header = () => {
  return (
    <div className='header'>
      <img src={logo} alt='logo' className='logo' />
      <a href='/'><h1 className='title'>Mercury Mailer</h1></a>
    </div>
  )
}

export default Header
