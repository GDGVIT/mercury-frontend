import React, { useState, useEffect } from 'react'
import { useLocation, Redirect, useHistory } from 'react-router-dom'
import grapesjs from 'grapesjs'
import grapesjsTouch from 'grapesjs-touch'
import grapesjsMJML from 'grapesjs-mjml'
import Header from '../Header/Header'
import RecipientInput from './RecipientInput'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import 'grapesjs/dist/css/grapes.min.css'
import './DnDEditor.css'

const EmailSentMessage = (props) => {
  if (!props.error) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#73AF55' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <polyline className='path check' fill='none' stroke='#73AF55' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' points='100.2,40.2 51.5,88.8 29.8,67.5 ' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails sent successfullly!</h3>
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
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Emails sent unsuccessfullly</h3>
    </div>
  )
}

const DnDEnditor = () => {
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
  const history = useHistory()

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

    // Mjmleditor.on('asset:upload:start', () => {
    // })

    // Mjmleditor.on('asset:upload:end', () => {
    // })

    Mjmleditor.Components.clear()
    if ((window.localStorage.getItem('mjml') === null || window.localStorage.getItem('mjml') === undefined) &&
    (window.localStorage.getItem('subject') === null || window.localStorage.getItem('subject') === undefined)) {
      Mjmleditor.addComponents(`
        <mjml>
          <mj-body>
          </mj-body>
        </mjml>
      `)
    } else {
      Mjmleditor.addComponents(window.localStorage.getItem('mjml'))
      setSubject(window.localStorage.getItem('subject'))
    }

    setEditor(Mjmleditor)
  }, [token])

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
    const accessExpirationTime = window.localStorage.getItem('accessExpirationTime')
    const emptyMjml = `<mjml><mj-body>
    </mj-body></mjml>`
    console.log(emptyMjml)
    console.log(mjml)

    if (new Date().getTime() > accessExpirationTime) {
      window.localStorage.removeItem('token')
    } else if (mjml === emptyMjml || !mjml) {
      await getMjml()
      if (subject === '') {
        setError(true)
        setSendError(true)
      }
    } else {
      setSendError(false)
      if (!error) {
        setButtonText(<PuffLoader css={LoaderCss} size={12} loading color='white' />)
        const formData = new window.FormData()
        setError(false)
        formData.append('sender_name', 'Sricharan Ramesh')
        formData.append('sender_email', 'charan1952001@gmail.com')
        formData.append('subject', subject)
        formData.append('recipients', recipients, recipients.name)
        formData.append('body_text', 'Hello world')

        window.fetch('https://mercury-mailer-dsc.herokuapp.com/send_email/send', {
          method: 'POST',
          headers: new window.Headers({
            Authorization: 'Bearer ' + token
          }),
          body: formData
        }).then((res) => {
          setButtonText('Send')
          console.log(res)
          if (res.status !== 200) {
            setSendError(true)
          }
          return res.json()
        }).then(data => {
          console.log(data)
          if (data[1] === undefined || data[1].substring(0, 10) !== 'Email sent!') {
            setSendError(true)
          } else {
            setSendError(false)
          }
          setSuccessModalOpen(true)
        }).catch(err => {
          console.error(err)
          setSuccessModalOpen(true)
          setSendError(true)
        })
      }
    }
  }

  const handleChangeCSV = () => {
    window.localStorage.setItem('mjml', editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
    window.localStorage.setItem('subject', subject)
    history.push('/csv')
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
            <EmailSentMessage error={sendError} />
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
            <button onClick={handleSend} className='send'>{buttonText}</button>
          </div>
        </div>
      </div>
      <div id='gjs' className='gjs' style={{ height: '0px' }} />
    </div>
  )
}

export default DnDEnditor
