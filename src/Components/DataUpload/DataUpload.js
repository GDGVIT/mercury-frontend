import React, { useState } from 'react'
import Header from '../Header/Header'
import './DataUpload.css'
import { Redirect, useHistory } from 'react-router-dom'

const DataUpload = () => {
  const history = useHistory()
  const [label, setLabel] = useState('Choose a file...')
  const [recipients, setRecipients] = useState([])
  const [buttonBool, setButtonBool] = useState(false)

  const handleChange = (event) => {
    setLabel(event.target.files[0].name)
    setRecipients(event.target.files[0])
    setButtonBool(true)
  }

  const handleNext = () => {
    history.push({
      pathname: '/editor',
      state: {
        recipients
      }
    })
  }

  return (
    <div style={{ maxHeight: '100vh', height: '100vh' }}>
      {
        ((window.localStorage.getItem('token') === null) ||
        (window.localStorage.getItem('token') === undefined) ||
        (new Date().getTime() > window.localStorage.getItem('accessExpirationTime') &&
        window.localStorage.removeItem('token'))) &&
          <Redirect to='/login' />
      }
      <Header />
      <div className='upload-body'>
        <div className='upload-content'>
          <h1>Uploading CSV File</h1>
          <h4>Select a file from the device</h4>
        </div>
        <div className='upload-container'>
          <div style={{ outline: 'none', width: '100%' }}>
            <h3>Click to Upload</h3>
            <div className='upload-box'>
              <input
                type='file'
                name='file'
                id='file'
                accept='.csv'
                className='inputfile inputfile-4'
                onChange={handleChange}
              />
              <label htmlFor='file'>
                <figure>
                  <svg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M77.1429 23.7805H67.5V13.3902C67.5 11.7713 66.2232 10.4634 64.6429 10.4634H36.5179L26.0446 0.201219C25.9114 0.0734245 25.7361 0.00160332 25.5536 0H2.85714C1.27679 0 0 1.30793 0 2.92683V57.0732C0 58.6921 1.27679 60 2.85714 60H65.1786C66.3393 60 67.3929 59.2774 67.8304 58.1707L79.7946 27.8049C79.9286 27.4573 80 27.0823 80 26.7073C80 25.0884 78.7232 23.7805 77.1429 23.7805ZM61.0714 23.7805H15.5357C14.375 23.7805 13.3214 24.503 12.8839 25.6098L6.42857 42V6.58537H23.2589L33.9375 17.0488H61.0714V23.7805Z' fill='#4285F4' />
                  </svg>
                </figure>
                <span>{label}</span>
              </label>
            </div>
          </div>
          <button
            className='next-button'
            onClick={handleNext}
            disabled={!buttonBool}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataUpload
