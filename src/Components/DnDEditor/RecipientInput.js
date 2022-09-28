import React, { useEffect, useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

const RecipientInput = (props) => {
  const [items, setItems] = useState([])
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const [disable, setDisable] = useState(true)
  const [buttonText, setButtonText] = useState('Send Test Mail')
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `
  const token = window.localStorage.getItem('token')
  const accessExpirationTime = window.localStorage.getItem('accessExpirationTime')
  const baseURL = process.env.REACT_APP_API_URL

  useEffect(() => {
    if (items.length === 0) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [items])

  const handleTest = async () => {
    setDisable(true)
    if (new Date().getTime() > accessExpirationTime) {
      // await props.handleRefreshToken()
      window.localStorage.removeItem('token')
    }
    const { subject, name, email, mjml, recipients, setRecipientModalOpen, setSuccessModalOpen, sendError } = props
    setButtonText(<PuffLoader css={LoaderCss} size={24} loading color='white' />)

    const formData = new window.FormData()
    formData.append('sender_name', name)
    formData.append('sender_email', email)
    formData.append('recipients', recipients, recipients.name)
    formData.append('subject', subject)
    formData.append('body_text', 'Hello world')
    formData.append('body_mjml', mjml)
    formData.append('test_recipient_emails', items)
    formData.append('aws_region', 'ap-south-1')

    window.fetch(`${baseURL}/send_email/send_test`, {
      method: 'POST',
      headers: new window.Headers({
        Authorization: 'Bearer ' + token
      }),
      body: formData
    }).then((res) => {
      setButtonText('Send Test Mail')
      if (res.status !== 200) {
        sendError.current = 1
      }
      return res.json()
    }).then(data => {
      console.log(data)
      let count = 0
      const dataSize = Object.keys(data).length - 1
      if (data[1].length > 29 && data[1].substring(0, 29) === 'Email address is not verified') {
        sendError.current = 5
        throw new Error('Email address is not verified')
      }
      for (const datum in data) {
        if (datum !== 'rejected_emails' && (data[datum] === undefined || data[datum].substring(0, 11) !== 'Email sent!')) {
          ++count
        }
      }
      if (count === dataSize) {
        sendError.current = 1
      } else if (count === 0) {
        sendError.current = 0
      } else {
        window.open(data.rejected_emails)
        sendError.current = 3
      }
      setRecipientModalOpen(false)
      setSuccessModalOpen(true)
      setDisable(false)
    }).catch(err => {
      console.error(err)
      setRecipientModalOpen(false)
      setSuccessModalOpen(true)
      setDisable(false)
    })
  }

  const handleKeyDown = event => {
    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault()

      const val = value.trim()

      if (val && isValid(val)) {
        setItems([...items, value])
        setValue('')
      }
    }
  }

  const handleChange = event => {
    setValue(event.target.value)
    setError(null)
  }

  const handleDelete = item => {
    setItems(items.filter(i => i !== item))
  }

  const isValid = (email) => {
    let error = null
    if (isInList(email)) {
      error = `${email} has already been added.`
    }
    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`
    }
    if (error) {
      setError(error)
      return false
    }
    return true
  }

  const isInList = (email) => {
    return items.includes(email)
  }

  const isEmail = (email) => {
    return (/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/).test(email)
  }

  return (
    <>
      <h2 style={{ display: 'block', margin: '10px auto' }}>Recipients Email Address</h2>
      {items.map(item => (
        <div className='tag-item' key={item}>
          {item}
          <button
            type='button'
            className='button'
            onClick={() => handleDelete(item)}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        className={'recipients-input ' + (error && ' has-error')}
        value={value}
        placeholder='Type or paste email addresses and press `Enter`...'
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      {error && <p className='error'>{error}</p>}
      <button className='send-test send-button' onClick={handleTest} disabled={disable}>{buttonText}</button>
    </>
  )
}

export default RecipientInput
