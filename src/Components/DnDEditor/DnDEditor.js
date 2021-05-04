import React, { useState, useEffect } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import './DnDEditor.css'

export const DnDEnditor = () => {
  const [subject, setSubject] = useState('')
  let editor
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

    // editor.Panels.addButton('devices-c', {
    //   id: 'send-button',
    //   className: 'btn-send-button',
    //   label: 'Send Mail',
    //   command (editor) {
    //     const mjml = editor.getHtml().replaceAll(/ id="([^"]+)"/g, '')
    //     const formData = new window.FormData()
    //     formData.append('sender_name', 'Mark')
    //     formData.append('sender_email', 'mark@gmail.com')
    //     formData.append('subject', 'DSC VIT Recruitment')
    //     formData.append('body_text', 'Hello world')
    //     formData.append('body_mjml', mjml)
    //     window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send', {
    //       method: 'POST',
    //       body: formData
    //     }).then((res) => {
    //       return res.json()
    //     }).then((data) => {
    //       console.log(data)
    //     })
    //   },
    //   active: false
    // })

    // editor.Panels.addButton('devices-c', {
    //   id: 'preview-button',
    //   className: 'btn-send-button',
    //   label: 'Preview',
    //   command (editor) {
    //   },
    //   active: false
    // })

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
    const mjml = editor.getHtml().replaceAll(/ id="([^"]+)"/g, '')
    formData.append('sender_name', 'Mark')
    formData.append('sender_email', 'mark@gmail.com')
    formData.append('subject', subject)
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

  return (
    <div>
      <Header />
      <div className='send-body'>
        <input onChange={handleChange} type='text' placeholder='Subject' className='subject' />
        {/* <button onClick={handlePreview}>Preview</button> */}
        <button onClick={handleSend} className='send'>Send</button>
      </div>
      <div id='email-editor' />
    </div>
  )
}

export default DnDEnditor
