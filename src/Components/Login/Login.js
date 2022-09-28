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
  const [buttonDisable, setButtonDisable] = useState(true)
  const history = useHistory()
  const baseURL = process.env.REACT_APP_API_URL
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `

  const handleChange = (event) => {
    setErrorMessage('')
    const cred = credentials
    cred[event.target.name] = event.target.value
    setCredentials(cred)
    if (cred.username !== '' && cred.password !== '') {
      setButtonDisable(false)
    } else {
      setButtonDisable(true)
    }
  }

  const handleEnter = (event) => {
    if (event.target.name === 'password' && event.key === 'Enter') {
      handleLogin()
    }
  }

  const handleLogin = () => {
    if (credentials.username !== '' && credentials.password !== '') {
      setButtonDisable(true)
      setButtonText(<PuffLoader css={LoaderCss} size={24} loading color='white' />)
      window.fetch(`${baseURL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then((res) => {
        if (res.status !== 200) {
          setButtonText('LOGIN')
          setButtonDisable(false)
          setErrorMessage('Login Error')
          throw new Error('Invalid Credentials')
        } else {
          return res.json()
        }
      }).then(data => {
        const now = new Date()
        if (data !== undefined && data !== null) {
          window.localStorage.setItem('token', data.access)
          window.localStorage.setItem('accessExpirationTime', now.getTime() + 86400000)
          history.push({
            pathname: '/home'
          })
        }
      }).catch(err => {
        console.error(err)
        setErrorMessage(err.message)
      })
    } else {
      setErrorMessage('Enter Credentials')
    }
  }

  const handleClick = () => {
    setVisible(!visible)
  }

  return (
    <div style={{ height: '100vh' }}>
      {
        (window.localStorage.getItem('token') !== undefined &&
        window.localStorage.getItem('token') !== null) &&
        (new Date().getTime() < window.localStorage.getItem('accessExpirationTime')) &&
        history.push('/home')
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
              onKeyPress={handleEnter}
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
            <button
              type='submit'
              onClick={handleLogin}
              disabled={buttonDisable}
            >
              {buttonText}
            </button>
          </div>
        </div>
        <img src={login} alt='login' className='login-background' />
      </div>
    </div>
  )
}

export default Login
