import React, { useState } from 'react'
import CSVReader from 'react-csv-reader'
import './DataUpload.css'
import { useHistory } from 'react-router-dom'

const DataUpload = () => {
  const history = useHistory()
  const [headerData, setHeaderData] = useState([])
  const [buttonBool, setButtonBool] = useState(false)

  const getHeaders = (data) => {
    console.log(data)
    return Object.keys(data[0])
  }

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleForce = (data) => {
    console.log(data)
    const headers = getHeaders(data)
    let id = 0
    let values
    setHeaderData(headers.map(header => {
      ++id
      values = []
      for (let i = 0; i < data.length; i++) {
        values.push(data[i][header])
      }
      return {
        id,
        name: header,
        data: values
      }
    }))
    setButtonBool(true)
  }

  const handleNext = () => {
    history.push({
      pathname: '/mail',
      state: { headers: headerData }
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
