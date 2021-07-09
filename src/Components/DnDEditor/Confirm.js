import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

const Confirm = (props) => {
  const { handleSendEmail, setConfirmModal, disable } = props
  const [buttonText, setButtonText] = useState('Yes')
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `

  const handleSend = async (confirmation) => {
    if (confirmation) {
      setButtonText(<PuffLoader css={LoaderCss} size={24} loading color='white' />)
      await handleSendEmail()
    } else {
      setConfirmModal(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ display: 'block', margin: '10px auto' }}>Are you sure?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button
          className='send-confirm'
          style={{ marginRight: '20px' }}
          onClick={() => handleSend(true)}
          disabled={disable}
        >
          {buttonText}
        </button>
        <button
          className='send-confirm'
          onClick={() => handleSend(false)}
          disabled={disable}
        >
          No
        </button>
      </div>
    </div>
  )
}

export default Confirm
