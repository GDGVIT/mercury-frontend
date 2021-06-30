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
  }
  return (
    <div className='message-sent'>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
        <circle className='path circle' fill='none' stroke='#D06079' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
        <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='34.4' y1='37.9' x2='95.8' y2='92.3' />
        <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='95.8' y1='38' x2='34.4' y2='92.2' />
      </svg>
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Email cannot be empty</h3>
    </div>
  )
}

const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [recipientModalOpen, setRecipientModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [error, setError] = useState(false)
  const sendError = useRef(2)
  const mjml = useRef(null)
  const token = window.localStorage.getItem('token')
  const recipients = location.state.recipients
  const [editor, setEditor] = useState(null)
  const history = useHistory()
  const emptyMjml = '<mjml><mj-body></mj-body></mjml>'

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

    if ((localMjml === null || localMjml === undefined) &&
    (localSubject === null || localSubject === undefined)) {
      Mjmleditor.addComponents(`
        <mjml>
          <mj-body>
          </mj-body>
        </mjml>
      `)
      mjml.current = `
      <mjml>
        <mj-body>
        </mj-body>
      </mjml>
    `
    } else {
      Mjmleditor.addComponents(window.localStorage.getItem('mjml'))
      setSubject(window.localStorage.getItem('subject'))
    }

    setEditor(Mjmleditor)
  }, [token, mjml])

  const handleChange = (event) => {
    setError(false)
    if (event.target.value === '') {
      setError(true)
    }
    setSubject(event.target.value)
  }

  const getMjml = () => {
    if (editor.getHtml() !== undefined && editor.getHtml() !== null) {
      mjml.current = editor.getHtml().replaceAll(/ id="([^"]+)"/g, '')
    }
  }

  const handleSend = async () => {
    window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    window.localStorage.setItem('subject', subject)
    const accessExpirationTime = window.localStorage.getItem('accessExpirationTime')

    if (new Date().getTime() > accessExpirationTime) {
      window.localStorage.removeItem('token')
    } else {
      sendError.current = 0
      if (!error) {
        const formData = new window.FormData()
        setError(false)
        formData.append('sender_name', 'Sricharan Ramesh')
        formData.append('sender_email', 'charan1952001@gmail.com')
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
          setConfirmModalOpen(false)
          if (res.status !== 200) {
            sendError.current = 1
          }
          return res.json()
        }).then(data => {
          console.log(data)
          if (data[1] === undefined || data[1].substring(0, 11) !== 'Email sent!') {
            sendError.current = 1
          } else {
            sendError.current = 0
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
    history.push('/csv')
  }

  const handleConfirm = async () => {
    getMjml()
    if (subject === '') {
      setError(true)
    } else if (mjml.current.replace(/\s/g, '') === emptyMjml) {
      sendError.current = 2
      setSuccessModalOpen(true)
    } else {
      setError(false)
      setConfirmModalOpen(true)
    }
  }

  const handleTest = async () => {
    getMjml()
    if (subject === '') {
      setError(true)
    } else {
      if (mjml.current.replace(/\s/g, '') === emptyMjml) {
        sendError.current = 2
        setSuccessModalOpen(true)
      } else {
        window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
        window.localStorage.setItem('subject', subject)
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
                <Confirm handleSend={handleSend} setConfirmModal={setConfirmModalOpen} />
            }
          </div>
        </div>
        <div className={successModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modalOpen-content'>
            <span onClick={() => setSuccessModalOpen(false)} className='close'>&times;</span>
            <EmailSentMessage error={sendError.current} />
          </div>
        </div>
        <div className='send-body'>
          <input
            type='text'
            onChange={handleChange}
            value={subject}
            placeholder='Subject'
            className={'subject ' + (error && 'has-error')}
          />
          <div className='send-btn-group'>
            <button onClick={handleChangeCSV} className='csv'>Change CSV</button>
            <button onClick={handleTest} className='send test'>Test</button>
            <button onClick={handleConfirm} className='send'>Send</button>
          </div>
        </div>
      </div>
      <div id='gjs' className='gjs' />
    </div>
  )
}

export default DnDEnditor
