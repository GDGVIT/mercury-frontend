import React, { useState, useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import RecipientInput from './RecipientInput'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

export const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [recipientModalOpen, setRecipientModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [error, setError] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [mjml, setMjml] = useState(null)
  const [buttonText, setButtonText] = useState('Send')
  const token = window.localStorage.getItem('token')
  const LoaderCss = css`
    display: block;
    margin: 0 10px;
  `
  const recipients = location.state.recipients
  const [editor, setEditor] = useState(null)
  useEffect(() => {
    const Mjmleditor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      avoidInlineStyle: false,
      plugins: [grapesjsMJML, grapesjsTouch],
      pluginsOpts: {
        [grapesjsMJML]: {}
      },
      height: '80%'
    })
    Mjmleditor.Components.clear()
    Mjmleditor.addComponents(`
      <mjml>
        <mj-body>
        </mj-body>
      </mjml>
    `)
    setEditor(Mjmleditor)
  }, [])

  const handleChange = (event) => {
    setError(false)
    if (event.target.value === '') {
      setError(true)
    }
    setSubject(event.target.value)
  }

  const getMjml = () => {
    if (editor.getHtml() !== undefined && editor.getHtml() !== null) {
      setMjml(editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    }
  }

  const handleSend = async () => {
    if (!mjml) {
      await getMjml()
    }
    if (subject === '') {
      setError(true)
    } else {
      setButtonText(<PuffLoader css={LoaderCss} size={11.5} loading color='white' />)
      const formData = new window.FormData()
      setError(false)
      formData.append('sender_name', 'Sricharan Ramesh')
      formData.append('sender_email', 'charan1952001@gmail.com')
      formData.append('subject', subject)
      formData.append('recipients', recipients, recipients.name)
      formData.append('body_text', 'Hello world')
      formData.append('body_mjml', mjml)
      formData.append('aws_region', 'ap-south-1')

      window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send', {
        method: 'POST',
        headers: new window.Headers({
          Authorization: 'Bearer ' + token
        }),
        body: formData
      }).then((res) => {
        setButtonText('Send')
        setSuccessModalOpen(true)
        if (res.status !== 200) {
          setSendError(true)
        } else {
          setSendError(false)
        }
        return res.json()
      }).then((data) => {
        console.log(data)
        editor.Components.clear()
        editor.addComponents(`
          <mjml>
            <mj-body>
            </mj-body>
          </mjml>
        `)
        setSubject('')
      })
    }
  }

  const handleTest = async () => {
    if (!mjml) {
      await getMjml()
    }
    if (subject === '') {
      setError(true)
    } else {
      await setSendError(false)
      setRecipientModalOpen(!recipientModalOpen)
    }
  }

  return (
    <div style={{ height: '100vh', maxHeight: '100vh' }}>
      {
        ((window.localStorage.getItem('token') === null) ||
        (window.localStorage.getItem('token') === undefined)) &&
          <Redirect to='/login' />
      }
      {
        (location.state.recipients === null || location.state.recipients === undefined) &&
          <Redirect to='/csv' />
      }
      <div className='non-editor'>
        <Header />
        <div className={recipientModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modal-content'>
            <span onClick={() => setRecipientModalOpen(false)} className='close'>&times;</span>
            {
              recipientModalOpen &&
                <RecipientInput
                  subject={subject}
                  mjml={mjml}
                  recipients={recipients}
                  setSendError={setSendError}
                  setRecipientModalOpen={setRecipientModalOpen}
                  setSuccessModalOpen={setSuccessModalOpen}
                />
            }
          </div>
        </div>
        <div className={successModalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modal-content'>
            <span onClick={() => setSuccessModalOpen(false)} className='close'>&times;</span>
            {
              sendError
                ?
                  <div>
                    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
                      <circle className='path circle' fill='none' stroke='#D06079' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
                      <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='34.4' y1='37.9' x2='95.8' y2='92.3' />
                      <line className='path line' fill='none' stroke='#D06079' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='95.8' y1='38' x2='34.4' y2='92.2' />
                    </svg>
                    <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails sent unsuccessfullly</h3>
                  </div>
                :
                  <div>
                    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
                      <circle className='path circle' fill='none' stroke='#73AF55' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
                      <polyline className='path check' fill='none' stroke='#73AF55' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' points='100.2,40.2 51.5,88.8 29.8,67.5 ' />
                    </svg>
                    <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails sent successfullly!</h3>
                  </div>
            }
          </div>
        </div>
        <div className='send-body'>
          <input onChange={handleChange} type='text' placeholder='Subject' className={'subject ' + (error && 'has-error')} />
          <div className='send-btn-group'>
            <button onClick={handleTest} className='send' style={{ marginRight: '10px' }}>Test</button>
            <button onClick={handleSend} className='send'>{buttonText}</button>
          </div>
        </div>
      </div>
      <div id='gjs' className='gjs' style={{ height: '0px' }} />
    </div>
  )
}

export default DnDEnditor