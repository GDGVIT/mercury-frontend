import React from 'react'

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
          <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' strokeWidth='4' fill='yellow' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Some emails were not sent</h3>
      </div>
    )
  } else if (props.error === 4) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#FFFF66' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <line className='path line' fill='none' stroke='#FFFF66' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='65.1' y1='37.9' x2='65.1' y2='75.3' />
          <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' strokeWidth='4' fill='yellow' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Could not upload image</h3>
      </div>
    )
  } else if (props.error === 5) {
    return (
      <div className='message-sent'>
        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
          <circle className='path circle' fill='none' stroke='#FFFF66' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
          <line className='path line' fill='none' stroke='#FFFF66' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='65.1' y1='37.9' x2='65.1' y2='75.3' />
          <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' strokeWidth='4' fill='yellow' />
        </svg>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Sender's email ID is not verified</h3>
      </div>
    )
  }
  return (
    <div className='message-sent'>
      <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
        <circle className='path circle' fill='none' stroke='#FFFF66' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
        <line className='path line' fill='none' stroke='#FFFF66' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' x1='65.1' y1='37.9' x2='65.1' y2='75.3' />
        <circle cx='65.1' cy='92.3' r='3' stroke='#FFFF66' strokeWidth='4' fill='yellow' />
      </svg>
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Email cannot be empty</h3>
    </div>
  )
}

export default EmailSentMessage
