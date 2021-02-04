import React, { useState, useEffect, useCallback, useMemo } from "react";
import firebase, { storage } from "../firebase";

function getNewFileList() {
  const storageRef = storage.ref();
  const publicImagesRef = storageRef.child("public").child("images");

  // Find all the prefixes and items.
  return publicImagesRef
    .listAll()
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      let itemsMetadataPromises = [];
      let itemsUrlPromises = [];

      let items = [];
      res.items.forEach((itemRef, index) => {
        itemsMetadataPromises.push(itemRef.getMetadata());
        itemsUrlPromises.push(itemRef.getDownloadURL());

        items.push({
          _id: index,
          title: itemRef.name,
          fileName: itemRef.name,
        });
      });

      return Promise.all(itemsMetadataPromises).then((resolvedArray) => {
        return Promise.all(itemsUrlPromises).then((urlsArray) => {
          const metadata = resolvedArray.map((item, itemIndex) => {
            items[itemIndex] = {
              ...items[itemIndex],
              size: item.size,
              type: item.contentType,
              createdAt: new Date(item.timeCreated),
              thumbnailUrl: urlsArray[itemIndex],
            };
          });
          return items;
        });
      });
    })
    .catch((error) => {
      return [];
    });
}
function clientSelectCallback() {}

function fileDelete(item) {
  const storageRef = storage.ref();
  const publicImagesRef = storageRef.child("public").child("images");

  const imageRef = publicImagesRef.child(item.fileName);

  return imageRef
    .delete()
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
}

export default function useMediaLibrary() {
  const [fileLibraryList, setFileLibraryList] = useState([]);

  useEffect(() => {
    getNewFileList().then((newFileList) => {
      setFileLibraryList(newFileList);
    });
  }, []);

  function uploadCallback(fileBlob, fileMeta) {
    const storageRef = storage.ref();
    const publicImagesRef = storageRef.child("public").child("images");
    const spaceRef = publicImagesRef.child(
      `${Date.now().toString()}-${fileMeta.fileName}`
    );

    return new Promise((resolve, reject) => {
      const uploadTask = spaceRef.putString(fileBlob, "data_url", fileMeta);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            getNewFileList().then((newFileList) => {
              setFileLibraryList(newFileList);
              resolve(downloadURL);
            });
          });
        }
      );
    });
  }

  function selectCallback(item) {
    // Hide modal

    // TODO Pass selected file back to client component callback function
    clientSelectCallback(item);
  }

  async function deleteCallback(item) {
    // TODO Delete file from backend service
    const result = await fileDelete(item);

    if (result == true) {
      const newFileList = await getNewFileList();
      setFileLibraryList(newFileList);
    }
  }

  return {
    uploadCallback,
    fileLibraryList,
    setFileLibraryList,
    selectCallback,
    deleteCallback,
  };
}
