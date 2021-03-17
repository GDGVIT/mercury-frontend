import React from 'react'
import './Landing.css'
import Header from '../Header/Header'
import Desktop from '../../assets/desktop-mail.svg'
import Green from '../../assets/green.svg'
import Red from '../../assets/red.svg'
import Yellow from '../../assets/yellow.svg'

const Landing = () => {
  return (
    <>
      <Header />
      <div className='body'>
        <h1 className='content'>BULK MAILING MADE EFFORTLESS</h1>
        <div className='buttons'>
          <a href='/login' style={{ background: '#4285F4' }}>SIGN IN</a>
          <a href='/register' style={{ background: '#D5D4D4' }}>SIGN UP</a>
        </div>
        <div className='desktop'>
          <img alt='desktop' src={Desktop} />
        </div>
      </div>
      <div className='background'>
        <img alt='red' style={{ position: 'absolute', right: '10%', bottom: '0', width: '40%' }} src={Red} />
        <img alt='green' style={{ position: 'absolute', right: '0', top: '10%', width: '15%' }} src={Green} />
        <img alt='yellow' style={{ position: 'absolute', right: '0', bottom: '10%', width: '15%' }} src={Yellow} />
      </div>
    </>
  )
}

export default Landing
