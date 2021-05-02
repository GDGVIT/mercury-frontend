import React, { useState } from 'react'
import Header from '../Header/Header'
import { useHistory } from 'react-router-dom'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import login from '../../assets/login.svg'
import './Login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [visible, setVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [buttonText, setButtonText] = useState('LOGIN')
  const [buttonDisable, setButtonDisable] = useState(false)
  const history = useHistory()
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `

  const handleChange = (event) => {
    setErrorMessage('')
    const cred = credentials
    cred[event.target.name] = event.target.value
    setCredentials(cred)
  }

  const handleLogin = () => {
    setButtonDisable(true)
    setButtonText(<PuffLoader css={LoaderCss} size={36} loading color='white' />)
    window.fetch('https://mercury-mailer-dsc.herokuapp.com/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then((res) => {
      if (res.status !== 200) {
        setButtonText('LOGIN')
        setButtonDisable(false)
        setErrorMessage('Login Error')
      }
      return res.json()
    }).then(data => {
      try {
        window.localStorage.setItem('token', data.access)
      } catch (err) {
        console.error(err)
        setErrorMessage('Login Error')
      }
      history.push('/csv')
    }).catch(err => {
      console.error(err)
      setErrorMessage('Login Error')
    })
  }

  const handleClick = () => {
    setVisible(!visible)
  }

  return (
    <div style={{ height: '100vh' }}>
      {
        (window.localStorage.getItem('token') !== undefined && window.localStorage.getItem('token') !== null) &&
        history.push('/csv')
      }
      <Header />
      <div className='login'>
        <div className='login-body'>
          <div className='login-content'>
            <h1>LOGIN</h1>
          </div>
          <div className='form'>
            <p>{errorMessage}</p>
            <input
              type='text'
              name='username'
              className='text-input'
              placeholder='Username or Email'
              onChange={handleChange}
              autoComplete='off'
            />
            <input
              type={visible ? 'text' : 'password'}
              name='password'
              className='text-input'
              placeholder='Password'
              onChange={handleChange}
            />
            <div>
              <input
                type='checkbox'
                className='checkbox'
                id='showPassword'
                name='showPassword'
                onClick={handleClick}
              />
              <label className='showPassword' htmlFor='showPassword'>Show Password</label>
            </div>
            <button type='submit' onClick={handleLogin} disabled={buttonDisable}>{buttonText}</button>
          </div>
        </div>
        <img src={login} className='login-background' />
      </div>
    </div>
  )
}

export default Login
