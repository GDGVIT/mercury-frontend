import React from 'react'
import './Landing.css'
import Header from '../Header/Header'
import Desktop from '../../assets/desktop-mail.svg'
import Green from '../../assets/green.svg'
import Red from '../../assets/red.svg'
import Yellow from '../../assets/yellow.svg'

const Landing = () => {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <div className='background'>
        <img alt='red' className='red' src={Red} />
        <img alt='green' className='green' src={Green} style={{ bottom: '15%' }} />
        <img alt='yellow' className='yellow' src={Yellow} />
      </div>
      <Header />
      <div className='body'>
        <h1 className='content'>BULK MAILING MADE EFFORTLESS!</h1>
        <div className='buttons'>
          <a href='/login' style={{ background: '#4285F4', color: 'white' }}>Login</a>
          <a href='/register' style={{ background: 'white', color: '#4285F4' }}>Register</a>
        </div>
        <div className='desktop'>
          <img alt='desktop' src={Desktop} />
        </div>
      </div>
    </div>
  )
}

export default Landing
