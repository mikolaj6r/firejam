import React, { useState, useEffect } from "react";
import { ReactMediaLibraryTabs } from "../components/MediaLibrary";
import useMediaLibrary from "../hooks/useMediaLibrary";

const ReactMediaLibraryWrapper = () => {
  const {
    uploadCallback,
    fileLibraryList,
    setFileLibraryList,
    selectCallback,
    deleteCallback,
  } = useMediaLibrary();

  return (
    <React.Fragment>
      <ReactMediaLibraryTabs
        fileUploadCallback={uploadCallback}
        fileLibraryList={fileLibraryList}
        fileSelectCallback={selectCallback}
        fileDeleteCallback={deleteCallback}
      />
    </React.Fragment>
  );
};

export default ReactMediaLibraryWrapper;
