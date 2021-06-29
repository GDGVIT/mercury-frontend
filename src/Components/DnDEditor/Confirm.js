import React, { useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { css } from '@emotion/core'
import './DnDEditor.css'

const Confirm = (props) => {
  const [buttonText, setButtonText] = useState('Yes')
  const LoaderCss = css`
    display: block;
    margin: 0 auto;
  `

  const handleSend = async (confirmation) => {
    if (confirmation) {
      setButtonText(<PuffLoader css={LoaderCss} size={24} loading color='white' />)
      await props.handleSend()
    } else {
      props.setConfirmModal(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ display: 'block', margin: '10px auto' }}>Are you sure?</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className='send' style={{ marginRight: '20px' }} onClick={() => handleSend(true)}>{buttonText}</button>
        <button className='send' onClick={() => handleSend(false)}>No</button>
      </div>
    </div>
  )
}

export default Confirm
