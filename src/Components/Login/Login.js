import React, { useState } from 'react'
import Header from '../Header/Header'
import { useHistory } from 'react-router-dom'
import login from '../../assets/login.svg'
import './Login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [visible, setVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const history = useHistory()

  const handleChange = (event) => {
    setErrorMessage('')
    console.log(event.target.value)
    const cred = credentials
    cred[event.target.name] = event.target.value
    setCredentials(cred)
  }

  const handleLogin = () => {
    console.log(credentials)
    window.fetch('https://mercury-mailer-dsc.herokuapp.com/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        history.push('/csv')
      } else {
        setErrorMessage('Login Error')
      }
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
      <Header />
      <div className='login'>
        <div className='login-body'>
          <div className='login-content'>
            <h1>LOGIN</h1>
            <h4>Do not have an account? <a href='/register'>Create one</a></h4>
            <p>{errorMessage}</p>
          </div>
          <div className='form'>
            <input
              type='text'
              name='username'
              className='text-input'
              placeholder='Username or Email'
              onChange={handleChange}
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
            <button type='submit' onClick={handleLogin}>LOG IN</button>
          </div>
        </div>
        <img src={login} className='login-background' />
      </div>
    </div>
  )
}

export default Login
