import React, { useCallback, useMemo, useRef, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import editorStyles from './editorStyles.module.css';
import mentions from './mentions';
import "@draft-js-plugins/mention/lib/plugin.css";

const ContentEditor = () => {
  const ref = useRef(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [open, setOpen] = useState(true);
  const [suggestions, setSuggestions] = useState(mentions);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

  const onExtractData = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    console.log(raw);
  };

  return (
    <div>
      <div className={editorStyles.editor} onClick={() => ref.current.focus()} >
        <Editor
          editorKey={'editor'}
          editorState={editorState}
          onChange={setEditorState}
          plugins={plugins}
          ref={ref}
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          onAddMention={() => {
            // get the mention object selected
          }}
        />
      </div>
      <button onClick={() => onExtractData()}>Extract data</button>
    </div>
  );
}

export default ContentEditor
  