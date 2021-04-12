import React, { Component } from 'react'
import styles from './editorStyles.module.css'

export default class ImageAdd extends Component {
  // Start the popover closed
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      open: false
    }
  }

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount () {
    document.addEventListener('click', this.handleClosePopover)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClosePopover)
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  handlePopoverClick () {
    this.preventNextClose = true
  }

  handleOpenPopover () {
    if (!this.state.open) {
      this.preventNextClose = true
      this.setState({
        open: true
      })
    }
  }

  handleClosePopover () {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false
      })
    }

    this.preventNextClose = false
  }

  handleAddImage () {
    const { editorState, onChange } = this.props
    onChange(this.props.modifier(editorState, this.state.url))
  }

  handleChangeUrl (evt) {
    this.setState({ url: evt.target.value })
  }

  render () {
    const popoverClassName = this.state.open
      ? styles.addImagePopover
      : styles.addImageClosedPopover
    const buttonClassName = this.state.open
      ? styles.addImagePressedButton
      : styles.addImageButton

    return (
      <div className={styles.addImage}>
        <button
          className={buttonClassName}
          onMouseUp={this.handleOpenPopover}
          type='button'
        >
          +
        </button>
        <div className={popoverClassName} onClick={this.handlePopoverClick}>
          <input
            type='text'
            placeholder='Paste the image url'
            className={styles.addImageInput}
            onChange={this.handleChangeUrl}
            value={this.state.url}
          />
          <button
            className={styles.addImageConfirmButton}
            type='button'
            onClick={this.handleAddImage}
          >
            Add
          </button>
        </div>
      </div>
    )
  }
}
