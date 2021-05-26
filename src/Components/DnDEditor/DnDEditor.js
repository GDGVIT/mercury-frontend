import React, { useState, useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import RecipientInput from './RecipientInput'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

export const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState(false)
  const [mjml, setMjml] = useState(null)
  const [buttonText, setButtonText] = useState('Send')
  const token = window.localStorage.getItem('token')
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `
  const recipients = location.state.recipients
  const [editor, setEditor] = useState(null)
  useEffect(() => {
    const Mjmleditor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      avoidInlineStyle: false,
      plugins: [grapesjsMJML],
      pluginsOpts: {
        [grapesjsMJML]: {}
      },
      height: '80%'
    })
    console.log(Mjmleditor)
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
    setSubject(event.target.value)
  }

  const getMjml = () => {
    if (editor.getHtml() !== undefined && editor.getHtml() !== null) {
      setMjml(editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    } else {
      setError('No Email created')
    }
  }

  const handleSend = async () => {
    setButtonText(<PuffLoader css={LoaderCss} size={12} loading color='white' />)
    const formData = new window.FormData()
    if (!mjml) {
      await getMjml()
    }
    if (subject === '') {
      setError(true)
    } else {
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
        if (res.status !== 200) {
          setError('Sending Error')
        }
        console.log(res)
        return res.json()
      }).then((data) => {
        console.log(data)
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
      setError(false)
      setModalOpen(!modalOpen)
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
        <div className={modalOpen ? 'modalOpen' : 'modalClose'}>
          <div className='modal-content'>
            <span onClick={handleTest} className='close'>&times;</span>
            {
              modalOpen &&
                <RecipientInput subject={subject} mjml={mjml} recipients={recipients} setModalOpen={setModalOpen} />
            }
          </div>
        </div>
        <div className='send-body'>
          <input onChange={handleChange} type='text' placeholder='Subject' className={'subject ' + (error && ' has-error')} />
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
