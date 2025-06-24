import React, { useState } from 'react';
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const MyTextEditor = ({ initialContent, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialContent) {
      // If you have initial content, convert it to ContentState
      const contentState = convertFromRaw(JSON.parse(initialContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Convert the content to raw JSON for saving or other processing
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    onChange(JSON.stringify(rawContentState));
  };

  return (
    <div className="text-editor">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
    </div>
  );
};

export default MyTextEditor;
