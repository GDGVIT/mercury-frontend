import React, { useState, useRef } from 'react'
import { EditorState, RichUtils, ContentState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import editorStyles from './editorStyles.module.css'
import '@draft-js-plugins/mention/lib/plugin.css'
import { useHistory } from 'react-router'

const Footer = () => {
  const ref = useRef(null)
  const history = useHistory()
  const [readOnly, setReadOnly] = useState(true)
  const [footerButtonText, setFooterButtonText] = useState('Edit Footer')
  const InitialContentState = ContentState.createFromText(`
    Riddhi Gupta
    Point of Contact
    +91 9408955501
    mailriddhigupta@gmail.com
    
    Shubham Srivastava
    Point of Contact
    +91 9818891967
    shubhamsriv99@outlook.com
  `)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(InitialContentState)
  )

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const editClick = () => {
    setReadOnly(!readOnly)
    if (readOnly) {
      setFooterButtonText('Set Footer')
    } else {
      setFooterButtonText('Edit Footer')
    }
  }

  const handleNext = () => {
    history.goBack()
  }

  return (
    <>
      <button onClick={editClick} style={{ margin: 'auto' }}>{footerButtonText}</button>
      <div className={editorStyles.editor} onClick={() => ref.current.focus()} style={{ width: '100%' }}>
        <Editor
          editorKey='editor'
          editorState={editorState}
          onChange={setEditorState}
          ref={ref}
          handleKeyCommand={handleKeyCommand}
          style={{ width: '75%' }}
          readOnly={readOnly}
        />
      </div>
      <button onClick={() => handleNext()} style={{ margin: 'auto' }}>OK!</button>
    </>
  )
}

export default Footer
