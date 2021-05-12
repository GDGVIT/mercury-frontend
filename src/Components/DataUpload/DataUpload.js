import React, { useState } from 'react'
import Header from '../Header/Header'
// import CSVReader from 'react-csv-reader'
import './DataUpload.css'
import { Redirect, useHistory } from 'react-router-dom'

const DataUpload = () => {
  const history = useHistory()
  // const [headerData, setHeaderData] = useState([])
  const [recipients, setRecipients] = useState([])
  const [buttonBool, setButtonBool] = useState(false)

  // const getHeaders = (data) => {
  //   return Object.keys(data[0])
  // }

  // const papaparseOptions = {
  //   header: true,
  //   dynamicTyping: true,
  //   skipEmptyLines: true,
  //   transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  // }

  // const handleForce = (data) => {
  //   console.log(data)
  //   const headers = getHeaders(data)
  //   let id = 0
  //   setHeaderData(headers.map(header => {
  //     ++id
  //     return {
  //       id,
  //       name: header
  //     }
  //   }))
  //   id = 0
  //   setRecipients(data.map((row) => {
  //     ++id
  //     return {
  //       id,
  //       value: row.email
  //     }
  //   }))
  //   setButtonBool(true)
  // }

  const handleChange = (event) => {
    setRecipients(event.target.files[0])
    setButtonBool(true)
  }

  const handleNext = () => {
    history.push({
      pathname: '/dnd',
      state: { recipients }
    })
  }

  return (
    <div>
      {
        ((window.localStorage.getItem('token') === null) ||
        (window.localStorage.getItem('token') === undefined)) &&
          <Redirect to='/login' />
      }
      <Header />
      <div className='container'>
        <input
          type='file'
          onChange={handleChange}
          accept='.csv'
        />
        <button onClick={handleNext} disabled={!buttonBool}>Next</button>
      </div>
    </div>
  )
}

export default DataUpload
