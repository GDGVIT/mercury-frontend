import React from 'react'
import Header from '../Header/Header'
import register from '../../assets/register.svg'
import './Register.css'

const Register = () => {
  return (
    <div style={{ maxHeight: '100vh' }}>
      <Header />
      <div style={{ width: '100%', position: 'relative' }}>
        <img src={register} className='register-background' />
        <div className='register-content'>
          <h1>SIGN UP</h1>
          <div className='form'>
            <input type='text' className='text-input' placeholder='Username' />
            <input type='text' className='text-input' placeholder='Email' />
            <input type='password' className='text-input' placeholder='Enter Password' />
            <input type='password' className='text-input' placeholder='Re-Enter Password' />
            <div>
              <input type='radio' className='radio-input' id='password' name='password' />
              <label htmlFor='password'>Show Password</label>
            </div>
            <button type='submit'>REGISTER</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
