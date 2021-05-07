import React, { useState, useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import RecipientInput from './RecipientInput'
import './DnDEditor.css'

export const DnDEnditor = () => {
  const location = useLocation()
  const [subject, setSubject] = useState('')
  const [mjml, setMjml] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  let editor
  let recipients

  useEffect(() => {
    editor = grapesjs.init({
      container: '#email-editor',
      fromElement: true,
      avoidInlineStyle: false,
      plugins: [grapesjsMJML],
      pluginsOpts: {
        [grapesjsMJML]: {}
      },
      height: '508px'
    })

    editor.Components.clear()
    editor.addComponents(`
      <mjml>
        <mj-body>
        </mj-body>
      </mjml>
    `)
  }, [])

  const handleChange = (event) => {
    setSubject(event.target.value)
  }

  // const handlePreview = () => {

  // }

  const handleSend = () => {
    const formData = new window.FormData()
    if (editor.getHtml() !== undefined && editor.getHtml() !== null) {
      setMjml(editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    } else {
      window.alert('Create an Email')
    }
    formData.append('sender_name', 'Mark')
    formData.append('sender_email', 'mark@gmail.com')
    formData.append('subject', subject)
    formData.append('recipients', recipients)
    formData.append('body_text', 'Hello world')
    formData.append('body_mjml', mjml)
    window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send', {
      method: 'POST',
      body: formData
    }).then((res) => {
      return res.json()
    }).then((data) => {
      console.log(data)
    })
  }

  const handleTest = () => {
    setModalOpen(!modalOpen)
  }

  if (location.state === undefined || location.state === null) {
    return <Redirect to='/csv' />
  } else {
    recipients = location.state.recipients
  }

  return (
    <div>
      <Header />
      <div className={modalOpen ? 'modalOpen' : 'modalClose'}>
        <div className='modal-content'>
          <span onClick={handleTest} className='close'>&times;</span>
          <RecipientInput subject={subject} mjml={mjml} />
        </div>
      </div>
      <div className='send-body'>
        <input onChange={handleChange} type='text' placeholder='Subject' className='subject' />
        {/* <button onClick={handlePreview}>Preview</button> */}
        <button onClick={handleTest} className='send' style={{ marginRight: '10px' }}>Test</button>
        <button onClick={handleSend} className='send'>Send</button>
      </div>
      <div id='email-editor' />
    </div>
  )
}

export default DnDEnditor
