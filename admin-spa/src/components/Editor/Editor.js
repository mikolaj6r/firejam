import React from "react";
import { Editor as CoreEditor } from "react-draft-wysiwyg";
import firebase, { storage } from "../../firebase";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";

function uploadImageCallBack(file) {
  const storageRef = storage.ref();
  const publicImagesRef = storageRef.child("public").child("images");
  const spaceRef = publicImagesRef.child(
    `${Date.now().toString()}-${file.name}`
  );

  return new Promise((resolve, reject) => {
    const uploadTask = spaceRef.put(file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }

        reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          resolve({
            data: {
              link: downloadURL,
            },
          });
        });
      }
    );
  });
}

export default function Editor(props) {
  return (
    <CoreEditor
      toolbar={{
        inline: { inDropdown: true },
        list: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: {
          uploadCallback: uploadImageCallBack,
        },
      }}
      editorClassName="editor"
      wrapperClassName="editor-wrapper"
      toolbarClassName="editor-toolbar"
      {...props}
    />
  );
}
