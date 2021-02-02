import * as React from "react";
import ReactMediaLibraryTabs from "./ReactMediaLibraryTabs";

import { Modal, ModalHeader, ModalBody } from "@windmill/react-ui";

const ReactMediaLibrary = (props) => {
  return (
    <Modal
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
        />
      </ModalBody>
    </Modal>
  );
};

ReactMediaLibrary.defaultProps = {
  modalTitle: "Media Library",
};

export default ReactMediaLibrary;
