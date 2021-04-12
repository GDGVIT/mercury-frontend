import React from 'react'
import Header from '../Header/Header'
import register from '../../assets/register.svg'
import './Register.css'

const Register = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Header />
      <div className='register'>
        <div className='register-body'>
          <div className='register-content'>
            <h1>SIGN UP</h1>
          </div>
          <div className='register-form'>
            <input type='text' className='text-input' placeholder='Username' />
            <input type='text' className='text-input' placeholder='Email' />
            <input type='password' className='text-input' placeholder='Enter Password' />
            <input type='password' className='text-input' placeholder='Re-Enter Password' />
            <div className='radio'>
              <input type='radio' className='radio-input' id='password' name='password' />
              <label htmlFor='password' className='showPassword'>Show Password</label>
            </div>
            <button type='submit'>REGISTER</button>
          </div>
        </div>
        <img src={register} className='register-background' />
      </div>
    </div>
  )
}

export default Register
