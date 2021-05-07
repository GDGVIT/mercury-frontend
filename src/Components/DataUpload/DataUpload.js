import React, { useState } from 'react'
import CSVReader from 'react-csv-reader'
import './DataUpload.css'
import { useHistory } from 'react-router-dom'

const DataUpload = () => {
  const history = useHistory()
  const [headerData, setHeaderData] = useState([])
  const [recipients, setRecipients] = useState([])
  const [buttonBool, setButtonBool] = useState(false)

  const getHeaders = (data) => {
    return Object.keys(data[0])
  }

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleForce = (data) => {
    const headers = getHeaders(data)
    let id = 0
    setHeaderData(headers.map(header => {
      ++id
      return {
        id,
        name: header
      }
    }))
    id = 0
    setRecipients(data.map((row) => {
      ++id
      return {
        id,
        value: row.email
      }
    }))
    setButtonBool(true)
  }

  const handleNext = () => {
    history.push({
      pathname: '/dnd',
      state: { headers: headerData, recipients }
    })
  }

  return (
    <div>
      <div className='container'>
        <CSVReader
          cssClass='react-csv-input'
          label='Upload CSV with email IDs'
          onFileLoaded={handleForce}
          parserOptions={papaparseOptions}
        />
        <button onClick={handleNext} disabled={!buttonBool}>Next</button>
      </div>
    </div>
  )
}

export default DataUpload
