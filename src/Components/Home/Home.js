import React from 'react'
import './Home.css'
import Header from '../Header/Header'
import Home from '../../assets/home.svg'

const Landing = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Header />
      <div className='body'>
        <div className='home-body'>
          <h1>Let's get you started!</h1>
          <p>1. Upload the list of emails in a CSV file.</p>
          <p>2. Design a personalised email template to send.</p>
          <p>3. Send emails in bulk effortlessly!</p>
          <div className='home-buttons'>
            <a href='/csv' style={{ background: '#4285F4', color: 'white' }}>Get Started</a>
          </div>
        </div>
        <img alt='desktop' className='home' src={Home} />
      </div>
    </div>
  )
}

export default Landing
