import React from 'react'
import CSVReader from 'react-csv-reader'
import './DataUpload.css'

const getHeaders = (data) => {
  console.log(Object.keys(data[0]))
}

const handleForce = (data, fileInfo) => {
  console.log(data, fileInfo)
  getHeaders(data)
}

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
}

const DataUpload = () => {
  return (
    <div className='container'>
      <CSVReader
        cssClass='react-csv-input'
        label='Select CSV with secret Death Star statistics'
        onFileLoaded={handleForce}
        parserOptions={papaparseOptions}
      />
      <p>and then open the console</p>
    </div>
  )
}

export default DataUpload
