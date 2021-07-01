import React from 'react'
import { Redirect } from 'react-router-dom'
import './Home.css'
import Header from '../Header/Header'
import HomeSvg from '../../assets/home.svg'

const Home = () => {
  // const handleDownload = () => {
  //   window.fetch({
  //     method: 'GET',
  //     url: 'https://mercury-mailer-dsc.herokuapp.com/download',
  //     responseType: 'arraybuffer'
  //   }).then((response) => response.blob()).then((blob) => {
  //     const url = window.URL.createObjectURL(new window.Blob([blob]))
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', 'Recipients.csv')
  //     document.body.appendChild(link)
  //     link.click()
  //     link.parentNode.removeChild(link)
  //   })
  // }

  return (
    <div style={{ height: '100vh' }}>
      {
        ((window.localStorage.getItem('token') === null) ||
        (window.localStorage.getItem('token') === undefined) ||
        (new Date().getTime() > window.localStorage.getItem('accessExpirationTime') &&
        window.localStorage.removeItem('token'))) &&
          <Redirect to='/login' />
      }
      <Header />
      <div className='home'>
        <div className='home-body'>
          <h1>Let's get you started!</h1>
          <p>1. Upload the list of emails in a CSV file.</p>
          <p>2. Design a personalised email template to send.</p>
          <p>3. Send emails in bulk effortlessly!</p>

          <div className='home-buttons'>
            <button>Download CSV Template</button>
            <a href='/csv'>Get Started</a>
          </div>
        </div>
        <img alt='desktop' className='homeImg' src={HomeSvg} />
      </div>
    </div>
  )
}

export default Home
