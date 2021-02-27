import React, { useCallback, useMemo, useRef, useState } from 'react'
import { EditorState, convertToRaw, RichUtils } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import editorStyles from './editorStyles.module.css'
import '@draft-js-plugins/mention/lib/plugin.css'
import { useHistory } from 'react-router-dom'

const ContentEditor = (props) => {
  const ref = useRef(null)
  const history = useHistory()
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [open, setOpen] = useState(true)
  // const [modal, setModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [suggestions, setSuggestions] = useState(props.location.state.headers)

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin()
    const { MentionSuggestions } = mentionPlugin
    const plugins = [mentionPlugin]
    return { plugins, MentionSuggestions }
  }, [])

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  const onOpenChange = useCallback((_open) => {
    setOpen(_open)
  }, [])

  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, props.location.state.headers))
  }, [])

  const onFileChange = event => {
    setSelectedFile(event.target.files[0])
    console.log(selectedFile)
  }

  const onExtractData = () => {
    const contentState = editorState.getCurrentContent()
    console.log(contentState)
    const raw = convertToRaw(contentState)
    const blocks = raw.blocks
    for (let i = 0; i < blocks.length; i++) {
      console.log(blocks[i])
    }
    console.log(raw)
  }

  const onPreview = () => {
    // setModal(true)
    const contentState = editorState.getCurrentContent()
    const raw = convertToRaw(contentState)
    const blocks = raw.blocks
    blocks.forEach(block => {
      let s = ''
      let start = 0
      block.entityRanges.forEach(mention => {
        s = s + block.text.substring(start, mention.offset - 1) + ' ' + raw.entityMap[mention.key].data.mention.data[0]
        start = mention.offset + mention.length
      })
      s = s + block.text.substring(start, block.text.length - 1)
      console.log(s)
    })
  }

  const onEditFooter = () => {
    history.push('/footer')
  }

  return (
    <>
      {/* {
        modal &&
          <div className='modal'> </div>
      } */}
      <div className='container'>
        <h1>Edit mails dynamically!</h1>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <input type='text' id='subject' placeholder='Subject' style={{ width: '50%' }} />
        </div>
        <input type='file' id='image' name='filename' style={{ margin: '50px' }} onChange={onFileChange} />
        <div className={editorStyles.editor} onClick={() => ref.current.focus()} style={{ width: '100%' }}>
          <Editor
            editorKey='editor'
            editorState={editorState}
            onChange={setEditorState}
            plugins={plugins}
            ref={ref}
            handleKeyCommand={handleKeyCommand}
            style={{ width: '75%' }}
          />
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={(mention) => {
              console.log(mention)
            }}
          />
        </div>
        <div>
          <button onClick={() => onExtractData()}>Extract data</button>
          <button onClick={() => onEditFooter()}>Edit Footer</button>
          <button onClick={() => onPreview()} style={{ marginLeft: '100px' }}>Preview</button>
        </div>
      </div>
    </>
  )
}

export default ContentEditor
