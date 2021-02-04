import React from "react";
import { Editor as CoreEditor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

import MediaButtonComponent from "./MediaButton";
import useMediaLibrary from "../../hooks/useMediaLibrary";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";

import "font-awesome/css/font-awesome.css";

function MediaButtonWrapper(props) {
  const {
    uploadCallback,
    fileLibraryList,
    setFileLibraryList,
    selectCallback,
    deleteCallback,
  } = useMediaLibrary();

  return (
    <MediaButtonComponent
      fileUploadCallback={uploadCallback}
      fileLibraryList={fileLibraryList}
      fileSelectCallback={selectCallback}
      fileDeleteCallback={deleteCallback}
      {...props}
    />
  );
}
export default function Editor(props) {
  return (
    <CoreEditor
      toolbar={{
        image: {
          component: MediaButtonWrapper,
          previewImage: true,
        },
      }}
      editorClassName="editor"
      wrapperClassName="editor-wrapper"
      toolbarClassName="editor-toolbar"
      {...props}
    />
  );
}

export { EditorState, convertToRaw, convertFromRaw };
