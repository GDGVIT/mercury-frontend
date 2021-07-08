import React, { useState, useEffect, useRef } from 'react'
import { useLocation, Redirect, useHistory } from 'react-router-dom'
import grapesjs from 'grapesjs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import Confirm from './Confirm'
import RecipientInput from './RecipientInput'
import 'grapesjs/dist/css/grapes.min.css'
import './DnDEditor.css'

const EmailSentMessage = (props) => {
  if (props.error === 0) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#73AF55' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <polyline className='path check' fill='none' stroke='#73AF55' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' points='100.2,40.2 51.5,88.8 29.8,67.5 ' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails sent successfullly!</h3>
      </div>
    )
  } else if (props.error === 1) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#D06079' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='34.4' y1='37.9' x2='95.8' y2='92.3' />
          <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='95.8' y1='38' x2='34.4' y2='92.2' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails not sent successfullly</h3>
      </div>
    )
  } else if (props.error === 3) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#FFFF66' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <line className='path line' fill='none' stroke='#FFFF66' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='65.1' y1='37.9' x2='65.1' y2='75.3' />
          <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' stroke-width='4' fill='yellow' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Some emails were not sent</h3>
      </div>
    )
  }
  return (
    <div className='message-sent'>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
        <circle className='path circle' fill='none' stroke='#FFFF66' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
        <line className='path line' fill='none' stroke='#FFFF66' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='65.1' y1='37.9' x2='65.1' y2='75.3' />
        <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' stroke-width='4' fill='yellow' />
      </svg>
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Email cannot be empty</h3>
    </div>
  )
}

const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [recipientModalOpen, setRecipientModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [subjectError, setSubjectError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [disable, setDisable] = useState(false)
  const [editor, setEditor] = useState(null)
  const sendError = useRef(2)
  const history = useHistory()
  const mjml = useRef(null)
  const token = window.localStorage.getItem('token')
  const recipients = location.state.recipients
  const emptyMjml = '<mjml><mj-body></mj-body></mjml>'
  const buttonDisable = subjectError || emailError || nameError

  useEffect(() => {
    const Mjmleditor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      avoidInlineStyle: false,
      plugins: [grapesjsMJML, grapesjsTouch],
      pluginsOpts: {
        [grapesjsMJML]: {}
      },
      height: '80%',
      assetManager: {
        storageType: '',
        storeOnChange: true,
        storeAfterUpload: true,
        assets: [],
        uploadFile: (e) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
          const imagesFormData = new window.FormData()
          for (let i = 0; i < files.length; i++) {
            const fileName = files[i].name.replace(/\.[^/.]+$/, '')
            imagesFormData.append('image', files[i])
            imagesFormData.append('file_name', fileName)
          }
          window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/get_image_url', {
            method: 'POST',
            headers: new window.Headers({
              Authorization: 'Bearer ' + token
            }),
            body: imagesFormData,
            contentType: false,
            crossDomain: true,
            dataType: 'json',
            mimeType: 'multipart/form-data',
            processData: false
          }).then(res => {
            if (res.status === 200) {
              return res.json()
            }
          }).then(data => {
            data.data.forEach(image => {
              Mjmleditor.AssetManager.add(image)
            })
          })
        }
      }
    })
    Mjmleditor.Components.clear()

    const localMjml = window.localStorage.getItem('mjml')
    const localSubject = window.localStorage.getItem('subject')
    const localEmail = window.localStorage.getItem('email')
    const localName = window.localStorage.getItem('name')

    if ((localSubject !== null && localSubject !== undefined) &&
    (localEmail !== null && localEmail !== undefined) &&
    (localName !== null && localName !== undefined)) {
      Mjmleditor.addComponents(localMjml)
      setSubject(localSubject)
      setSenderEmail(localEmail)
      setSenderName(localName)
    } else if (localMjml === null || localMjml === undefined) {
      Mjmleditor.addComponents(`
        <mjml>
          <mj-body>
          </mj-body>
        </mjml>
      `)
    } else {
      if (localSubject === null || localSubject === undefined) {
        setSubject('')
      }
      if (localEmail === null || localEmail === undefined) {
        setSenderEmail('')
      }
      if (localName === null || localName === undefined) {
        setSenderName('')
      }
    }

    setEditor(Mjmleditor)
  }, [token])

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    if (name === 'subject') {
      setSubject(value)
      if (event.target.value === '') {
        setSubjectError(true)
      } else {
        setSubjectError(false)
      }
    } else if (name === 'email') {
      const emails = value.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g)
      setSenderEmail(value)
      if (event.target.value === '') {
        setEmailError(true)
      } else if (!emails) {
        setEmailError(true)
      } else {
        setEmailError(false)
      }
    } else {
      setSenderName(value)
      if (event.target.value === '') {
        setNameError(true)
      } else {
        setNameError(false)
      }
    }
  }

  const getMjml = () => {
    if (editor.getHtml() !== undefined && editor.getHtml() !== null) {
      mjml.current = editor.getHtml().replaceAll(/ id="([^"]+)"/g, '')
    }
  }

  const handleSend = async () => {
    setDisable(true)
    window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    window.localStorage.setItem('subject', subject)
    window.localStorage.setItem('email', senderEmail)
    window.localStorage.setItem('name', senderName)
    const accessExpirationTime = window.localStorage.getItem('accessExpirationTime')

    if (new Date().getTime() > accessExpirationTime) {
      window.localStorage.removeItem('token')
    } else {
      sendError.current = 0
      if (!emailError && !nameError && !subjectError) {
        const formData = new window.FormData()
        formData.append('sender_name', senderName)
        formData.append('sender_email', senderEmail)
        formData.append('subject', subject)
        formData.append('recipients', recipients, recipients.name)
        formData.append('body_mjml', mjml.current)
        formData.append('body_text', 'Hello world')
        formData.append('aws_region', 'ap-south-1')

        window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send', {
          method: 'POST',
          headers: new window.Headers({
            Authorization: 'Bearer ' + token
          }),
          body: formData
        }).then((res) => {
          setDisable(false)
          setConfirmModalOpen(false)
          if (res.status !== 200) {
            sendError.current = 1
          }
          return res.json()
        }).then(data => {
          let count = 0
          const dataSize = Object.keys(data).length
          // const failedEmails = []
          for (const datum in data) {
            if (data[datum] === undefined || data[datum].substring(0, 11) !== 'Email sent!') {
              ++count
              console.log(datum)
            }
          }
          if (count === dataSize) {
            sendError.current = 1
          } else if (count === 0) {
            sendError.current = 0
          } else {
            sendError.current = 3
          }
          setSuccessModalOpen(true)
        }).catch(err => {
          console.error(err)
          setSuccessModalOpen(true)
          sendError.current = 1
        })
      }
    }
  }

  const handleChangeCSV = () => {
    window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    window.localStorage.setItem('subject', subject)
    window.localStorage.setItem('email', senderEmail)
    window.localStorage.setItem('name', senderName)
    history.push('/csv')
  }

  const handleConfirm = () => {
    getMjml()
    if (subject === '') {
      setSubjectError(true)
    } if (senderEmail === '') {
      setEmailError(true)
    } if (senderName === '') {
      setNameError(true)
    } else if (mjml.current.replace(/\s/g, '') === emptyMjml) {
      sendError.current = 2
      setSuccessModalOpen(true)
    } else {
      setEmailError(false)
      setSubjectError(false)
      setNameError(false)
      setConfirmModalOpen(true)
    }
  }

  const handleTest = () => {
    getMjml()
    if (subject === '') {
      setSubjectError(true)
    } if (senderEmail === '') {
      setEmailError(true)
    } if (senderName === '') {
      setNameError(true)
    } else {
      if (mjml.current.replace(/\s/g, '') === emptyMjml) {
        sendError.current = 2
        setSuccessModalOpen(true)
      } else {
        window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
        window.localStorage.setItem('subject', subject)
        window.localStorage.setItem('email', senderEmail)
        window.localStorage.setItem('name', senderName)
        sendError.current = 0
        setRecipientModalOpen(!recipientModalOpen)
      }
    }
  }

  return (
    <div>
      {
        ((window.localStorage.getItem('token') === null) ||
        (window.localStorage.getItem('token') === undefined) ||
        (new Date().getTime() > window.localStorage.getItem('accessExpirationTime') &&
        window.localStorage.removeItem('token'))) &&
          <Redirect to='/login' />
      }
      {
        (location.state.recipients === null || location.state.recipients === undefined) &&
          <Redirect to='/csv' />
      }
      <div className='non-editor'>
        <Header />
        <div className={recipientModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modalOpen-content'>
            <span onClick={() => setRecipientModalOpen(false)} className='close'>&times;</span>
            {
              recipientModalOpen &&
                <RecipientInput
                  subject={subject}
                  email={senderEmail}
                  name={senderName}
                  mjml={mjml.current}
                  recipients={recipients}
                  sendError={sendError}
                  setRecipientModalOpen={setRecipientModalOpen}
                  setSuccessModalOpen={setSuccessModalOpen}
                />
            }
          </div>
        </div>
        <div className={confirmModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modalOpen-content confirm'>
            <span onClick={() => setConfirmModalOpen(false)} className='close'>&times;</span>
            {
              confirmModalOpen &&
                <Confirm
                  handleSendEmail={handleSend}
                  setConfirmModal={setConfirmModalOpen}
                  disable={disable}
                />
            }
          </div>
        </div>
        <div className={successModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modalOpen-content confirm'>
            <span onClick={() => setSuccessModalOpen(false)} className='close'>&times;</span>
            <EmailSentMessage error={sendError.current} />
          </div>
        </div>
        <div className='send-body'>
          <input
            type='text'
            onChange={handleChange}
            value={senderEmail}
            name='email'
            placeholder='Email Address'
            className={'details ' + (emailError && 'has-error')}
          />
          <input
            type='text'
            onChange={handleChange}
            value={senderName}
            name='name'
            placeholder='Name'
            className={'details ' + (nameError && 'has-error')}
          />
          <input
            type='text'
            onChange={handleChange}
            value={subject}
            name='subject'
            placeholder='Subject'
            className={'details ' + (subjectError && 'has-error')}
          />
          <div className='send-btn-group'>
            <button onClick={handleChangeCSV} className='csv'>Change CSV</button>
            <button onClick={handleTest} className='send test' disabled={buttonDisable}>Test</button>
            <button onClick={handleConfirm} className='send' disabled={buttonDisable}>Send</button>
          </div>
        </div>
      </div>
      <div id='gjs' className='gjs' />
    </div>
  )
}

export default DnDEnditor
