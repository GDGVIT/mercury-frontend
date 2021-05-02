import React, { useCallback, useMemo, useRef, useState, Component } from 'react'
import { EditorState, convertToRaw, RichUtils, Modifier } from 'draft-js'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import createImagePlugin from '@draft-js-plugins/image'
import createAlignmentPlugin from '@draft-js-plugins/alignment'
import createFocusPlugin from '@draft-js-plugins/focus'
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop'
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload'
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from '@draft-js-plugins/buttons'
import editorStyles from './editorStyles.module.css'
import mockUpload from './mockUpload'
import '@draft-js-plugins/alignment/lib/plugin.css'
import '@draft-js-plugins/static-toolbar/lib/plugin.css'
import { useHistory, useLocation, Redirect } from 'react-router-dom'

class HeadlinesPicker extends Component {
  componentDidMount () {
    setTimeout(() => {
      window.addEventListener('click', this.onWindowClick)
    })
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.onWindowClick)
  }

  onWindowClick () {
    this.props.onOverrideContent(undefined)
  }

  render () {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton]
    return (
      <div>
        {buttons.map((Button, i) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    )
  }
}

class HeadlinesButton extends Component {
  handleClick () {
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker)
  }

  render () {
    return (
      <div className={editorStyles.headlineButtonWrapper}>
        <button onClick={this.handleClick} className={editorStyles.headlineButton}>
          H
        </button>
      </div>
    )
  }
}

class ColorsButton extends Component {
  handleClick () {
    this.props.onOverrideContent(ColorControls)
  }

  render () {
    return (
      <div className={editorStyles.headlineButtonWrapper}>
        <button onClick={this.handleClick} className={editorStyles.colorsButton}>
          Color
        </button>
      </div>
    )
  }
}

const StyleButton = (props) => {
  function handleToggle (e) {
    e.preventDefault()
    props.onToggle(props.style)
  }

  let style
  if (props.active) {
    style = { ...styles.styleButton, ...colorStyleMap[props.style] }
  } else {
    style = styles.styleButton
  }

  return (
    <span style={style} onMouseDown={handleToggle}>
      {props.label}
    </span>
  )
}

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    fontSize: 14,
    padding: 20,
    width: 600
  },
  editor: {
    borderTop: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    marginTop: 20,
    minHeight: 400,
    paddingTop: 20
  },
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none'
  },
  styleButton: {
    color: '#999',
    cursor: 'pointer',
    marginRight: 16,
    padding: '2px 0'
  }
}

const COLORS = [
  { label: 'Red', style: 'red' },
  { label: 'Orange', style: 'orange' },
  { label: 'Yellow', style: 'yellow' },
  { label: 'Green', style: 'green' },
  { label: 'Blue', style: 'blue' },
  { label: 'Indigo', style: 'indigo' },
  { label: 'Violet', style: 'violet' }
]

const ColorControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div style={styles.controls}>
      {
        COLORS.map(colorType => {
          return (
            <StyleButton
              key={colorType.label}
              active={currentStyle.has(colorType.style)}
              label={colorType.label}
              onToggle={props.onToggle}
              style={colorType.style}
            />
          )
        })
      }
    </div>
  )
}

const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)'
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)'
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)'
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)'
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)'
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)'
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)'
  }
}

const focusPlugin = createFocusPlugin()
const resizeablePlugin = createResizeablePlugin()
const blockDndPlugin = createBlockDndPlugin()
const alignmentPlugin = createAlignmentPlugin()
const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin
const { AlignmentTool } = alignmentPlugin

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
)
const imagePlugin = createImagePlugin({ decorator })

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage
})

const ContentEditor = () => {
  let headers
  const location = useLocation()
  const ref = useRef(null)
  const history = useHistory()
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [open, setOpen] = useState(true)

  const { MentionSuggestions, mentionPlugin } = useMemo(() => {
    const mentionPlugin = createMentionPlugin()
    const { MentionSuggestions } = mentionPlugin
    return { mentionPlugin, MentionSuggestions }
  }, [])

  const plugins = [
    dragNDropFileUploadPlugin,
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    mentionPlugin,
    toolbarPlugin
  ]

  const [suggestions, setSuggestions] = useState([])

  const onOpenChange = useCallback((_open) => {
    setOpen(_open)
  }, [])

  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, headers))
  }, [])

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  if (location.state === undefined || location.state === null) {
    return <Redirect to='/csv' />
  } else {
    headers = location.state.headers
  }

  const toggleColor = (toggledColor) => {
    const selection = editorState.getSelection()
    const nextContentState = Object.keys(colorStyleMap).reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color)
    }, editorState.getCurrentContent())

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    )

    const currentStyle = editorState.getCurrentInlineStyle()

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color)
      }, nextEditorState)
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      )
    }

    setEditorState(nextEditorState)
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

  // const onPreview = () => {
  //   const contentState = editorState.getCurrentContent()
  //   const raw = convertToRaw(contentState)
  //   const blocks = raw.blocks
  //   blocks.forEach(block => {
  //     let s = ''
  //     let start = 0
  //     block.entityRanges.forEach(mention => {
  //       s = s + block.text.substring(start, mention.offset - 1) + ' ' + raw.entityMap[mention.key].data.mention.data[0]
  //       start = mention.offset + mention.length
  //     })
  //     s = s + block.text.substring(start, block.text.length - 1)
  //     console.log(s)
  //   })
  // }

  const onEditFooter = () => {
    history.push('/footer')
  }

  return (
    <div>
      {
        !window.localStorage.getItem('token') &&
        history.push('/login')
      }
      <div className='container'>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <input label='subject' type='text' id='subject' placeholder='Subject' style={{ width: '50%' }} />
        </div>
        <div className={editorStyles.editor} onClick={() => ref.current.focus()} style={{ width: '100%' }}>

          <AlignmentTool />
          <Editor
            editorKey='editor'
            customStyleMap={colorStyleMap}
            editorState={editorState}
            onChange={setEditorState}
            plugins={plugins}
            ref={ref}
            handleKeyCommand={handleKeyCommand}
            style={{ width: '75%' }}
          />
          {/* <ImageAdd
            editorState={editorState}
            onChange={setEditorState}
            modifier={imagePlugin.addImage}
          /> */}
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={(mention) => {
              console.log(mention)
            }}
          />
          <Toolbar className='toolbar'>
            {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <Separator {...externalProps} />
                  <HeadlinesButton {...externalProps} />
                  <ColorsButton {...externalProps} onToggle={toggleColor} editorState={editorState} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  <CodeBlockButton {...externalProps} />
                </div>
              )
            }
          </Toolbar>
        </div>
        <div>
          <button onClick={() => onExtractData()}>Extract data</button>
          <button onClick={() => onEditFooter()}>Edit Footer</button>
          {/* <button onClick={() => onPreview()} style={{ marginLeft: '100px' }}>Preview</button> */}
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
