import * as React from "react";
import ReactMediaLibraryTabs from "./ReactMediaLibraryTabs";

import { ModalHeader, ModalBody } from "@windmill/react-ui";

import CustomModal from "../../CustomModal/CustomModal";

const ReactMediaLibrary = (props) => {
  return (
    <CustomModal
      size="xl"
      isOpen={props.show}
      onClose={props.onHide}
      id="react-media-library-modal"
      aria-labelledby="react-media-library-modal"
    >
      <ModalHeader closeButton>{props.modalTitle}</ModalHeader>
      <ModalBody>
        <ReactMediaLibraryTabs
          isModal={true}
          fileLibraryList={props.fileLibraryList}
          fileUploadCallback={props.fileUploadCallback}
          fileSelectCallback={props.fileSelectCallback}
          fileDeleteCallback={props.fileDeleteCallback}
          libraryCardComponent={props.libraryCardComponent}
          additionalTabs={props.additionalTabs}
        />
        {props.children}
      </ModalBody>
    </CustomModal>
  );
};

ReactMediaLibrary.defaultProps = {
  modalTitle: "Media Library",
};

export default ReactMediaLibrary;
