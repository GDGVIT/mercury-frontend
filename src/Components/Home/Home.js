import React from 'react'
import { Redirect } from 'react-router-dom'
import './Home.css'
import Header from '../Header/Header'
import HomeSvg from '../../assets/home.svg'

const Home = () => {
  const token = window.localStorage.getItem('token')
  const handleDownload = async () => {
    await window.fetch({
      method: 'GET',
      url: 'https://mercury-mailer-dsc.herokuapp.com/send_email/get_csv',
      headers: new window.Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      })
    }).then(res => {
      if (res.status !== 200) {
        throw new Error('Server error')
      }
      return res.json()
    }).then(url => {
      console.log(url)
      // const link = document.createElement('a')
      // link.href = url
      // link.setAttribute('download', 'Recipients.csv')
      // document.body.appendChild(link)
      // link.click()
      // link.parentNode.removeChild(link)
    }).catch(err => {
      console.error(err)
    })
  }

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
            <button onClick={handleDownload}>Download CSV Template</button>
            <a href='/csv'>Get Started</a>
          </div>
        </div>
        <img alt='desktop' className='homeImg' src={HomeSvg} />
      </div>
    </div>
  )
}

export default Home
