import React, { useState, useEffect, useRef } from 'react'
import { useLocation, Redirect, useHistory } from 'react-router-dom'
import grapesjs from 'grapesjs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import Confirm from './Confirm'
import RecipientInput from './RecipientInput'
import EmailSentMessage from './EmailSentMessage'
import 'grapesjs/dist/css/grapes.min.css'
import './DnDEditor.css'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'

const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [recipientModalOpen, setRecipientModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [uploadLoad, setUploadLoad] = useState(false)
  const [subjectError, setSubjectError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [disable, setDisable] = useState(false)
  const [editor, setEditor] = useState(null)
  const sendError = useRef(2)
  const history = useHistory()
  const mjml = useRef(null)
  const token = window.localStorage.getItem('token')
  let recipients
  if (location.state !== undefined) {
    recipients = location.state.recipients
  }
  const emptyMjml = '<mjml><mj-body></mj-body></mjml>'
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `
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
          setUploadLoad(true)
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
            setUploadLoad(false)
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
          const dataSize = Object.keys(data).length - 1
          for (const datum in data) {
            if (datum !== 'rejected_emails' && (data[datum] === undefined || data[datum].substring(0, 11) !== 'Email sent!')) {
              ++count
            }
          }
          if (count === dataSize) {
            window.open(data.rejected_emails)
            sendError.current = 1
            window.open()
          } else if (count === 0) {
            sendError.current = 0
          } else {
            window.open(data.rejected_emails)
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
        ((location.state === null || location.state === undefined) ||
        (location.state.recipients === null || location.state.recipients === undefined)) &&
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
        <div className={uploadLoad ? 'modalOpen' : 'modalClose'}>
          <div style={{ zIndex: '15' }}>
            <span onClick={() => setConfirmModalOpen(false)} className='close'>&times;</span>
            {
              uploadLoad &&
                <PuffLoader css={LoaderCss} size={48} loading color='white' />
            }
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
