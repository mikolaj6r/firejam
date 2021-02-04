import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploadList from "./FileUploadList";

const DEFAULT_ACCEPT = ["image/jpeg, image/png"];

function readFile(file) {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  });
}

const FileUpload = (props) => {
  const [fileUploadList, setFileUploadList] = useState([]);

  function onDrop(acceptedFiles) {
    let newFileUploadList = acceptedFiles
      .map((element) => {
        return { fileName: element.name, status: 0 };
      })
      .concat(fileUploadList);
    setFileUploadList(newFileUploadList);

    // Loop through dropped files
    acceptedFiles.forEach((file, index) => {
      (async () => {
        const fileBase64 = await readFile(file);
        const fileMeta = {
          fileName: file.name,
          type: file.type,
          size: file.size,
        };
        const result = await props.fileUploadCallback(fileBase64, fileMeta);
        newFileUploadList = [...newFileUploadList];
        newFileUploadList[index].status = result ? 1 : -1;
        setFileUploadList(newFileUploadList);
      })();
    });
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: props.multiple || false,
  });
  return (
    <React.Fragment>
      <div
        className={`mt-2 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-md text-white${
          isDragActive ? "bg-green" : "bg-black"
        }`}
        {...getRootProps()}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-100"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <div className="flex text-sm text-white">
            <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              Upload a file
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              {...getInputProps()}
            />
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-100">PNG or JPEG</p>
        </div>
      </div>
      <FileUploadList fileUploadList={fileUploadList} />
    </React.Fragment>
  );
};

export default FileUpload;
