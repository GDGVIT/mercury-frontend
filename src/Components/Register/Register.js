import React, { useState } from 'react'
import Header from '../Header/Header'
import { useHistory } from 'react-router-dom'
import register from '../../assets/register.svg'
import './Register.css'

const Register = () => {
  const [credentials, setCredentials] = useState({ username: '', email: '', password1: '', password2: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const history = useHistory()

  const handleChange = (event) => {
    setErrorMessage('')
    console.log(event.target.value)
    const cred = credentials
    cred[event.target.name] = event.target.value
    setCredentials(cred)
  }

  const handleRegister = () => {
    console.log(credentials)
    if (credentials.password1 === credentials.password2) {
      window.fetch('/user/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then((res) => {
        console.log(res)
        history.push({
          pathname: '/csv'
        })
      }).catch(err => {
        console.error(err)
        setErrorMessage('Error')
      })
    } else {
      setErrorMessage('Password does not match')
    }
  }

  return (
    <div style={{ height: '100vh' }}>
      <Header />
      <div className='register'>
        <div className='register-body'>
          <div className='register-content'>
            <h1>SIGN UP</h1>
            <h4>Already have an account? <a href='/login'>Login</a></h4>
            <p>{errorMessage}</p>
          </div>
          <div className='register-form'>
            <input
              type='text'
              name='username'
              className='text-input'
              placeholder='Username'
              onChange={handleChange}
            />
            <input
              type='text'
              name='email'
              className='text-input'
              placeholder='Email'
              onChange={handleChange}
            />
            <input
              type='password'
              name='password1'
              className='text-input'
              placeholder='Enter Password'
              onChange={handleChange}
            />
            <input
              type='password'
              name='password2'
              className='text-input'
              placeholder='Re-Enter Password'
              onChange={handleChange}
            />
            <button type='submit' onClick={handleRegister}>REGISTER</button>
          </div>
        </div>
        <img src={register} className='register-background' />
      </div>
    </div>
  )
}

export default Register
