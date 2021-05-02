import React, { useEffect } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import grapesjsMJML from 'grapesjs-mjml'

const DnDEditor = () => {
  useEffect(() => {
    const editor = grapesjs.init({
      clearOnRender: true,
      cleanId: true,
      resetBlocks: true,
      container: '#email-editor',
      fromElement: true,
      avoidInlineStyle: false,
      plugins: [grapesjsMJML],
      pluginsOpts: {
        [grapesjsMJML]: {}
      }
    })
    console.log(editor.getHtml().replaceAll(/ id="([^"]+)"/g, ''))
  }, [])
  return (
    <div>
      <div id='email-editor' />
    </div>
  )
}

export default DnDEditor
