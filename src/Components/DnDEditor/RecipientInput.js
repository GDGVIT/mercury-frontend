import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

const RecipientInput = (props) => {
  const [items, setItems] = useState([])
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const [buttonText, setButtonText] = useState('Send Test Mail')
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `
  const token = window.localStorage.getItem('token')

  const handleTest = () => {
    const { subject, mjml, recipients, setRecipientModalOpen, setSuccessModalOpen, setSendError } = props
    setButtonText(<PuffLoader css={LoaderCss} size={24} loading color='white' />)

    const formData = new window.FormData()
    formData.append('sender_name', 'Sricharan')
    formData.append('sender_email', 'charan1952001@gmail.com')
    formData.append('recipients', recipients, recipients.name)
    formData.append('subject', subject)
    formData.append('body_text', 'Hello world')
    formData.append('body_mjml', mjml)
    formData.append('test_recipient_emails', items)
    formData.append('aws_region', 'ap-south-1')

    window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send_test', {
      method: 'POST',
      headers: new window.Headers({
        Authorization: 'Bearer ' + token
      }),
      body: formData
    }).then((res) => {
      setButtonText('Send Test Mail')
      setRecipientModalOpen(false)
      setSuccessModalOpen(true)
      if (res.status === 200) {
        setSendError(false)
      } else {
        setSendError(true)
      }
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

  const handlePaste = event => {
    event.preventDefault()
    const paste = event.clipboardData.getData('text')
    const emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g)
    if (emails) {
      const toBeAdded = emails.filter(email => !isInList(email))
      setItems(...items, ...toBeAdded)
    }
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
        onPaste={handlePaste}
      />
      {error && <p className='error'>{error}</p>}
      <button className='send-test' onClick={handleTest}>{buttonText}</button>
    </>
  )
}

export default RecipientInput
