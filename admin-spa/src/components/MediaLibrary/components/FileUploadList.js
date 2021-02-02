import React from "react";
import { Badge } from "@windmill/react-ui";

function renderBadge(status) {
  switch (status) {
    case -1:
      return <Badge type="danger">Failed</Badge>;
    case 0:
      return <Badge type="primary">Processing</Badge>;
    case 1:
      return <Badge type="success">Success</Badge>;
  }
  return;
}

const FileUploadList = (props) => {
  function renderList() {
    return props.fileUploadList.map((element, index) => {
      return (
        <li
          key={index}
          className="list-group-item inline-flex flex-row justify-between items-center text-sm"
        >
          <span className="mr-4">{element.fileName}</span>
          {renderBadge(element.status)}
        </li>
      );
    });
  }

  return (
    <div className="text-white my-4">
      {props.fileUploadList.length > 0 && (
        <h3 className="text-2xl">Uploaded Files</h3>
      )}
      <ul className="list-groups p-0">{renderList()}</ul>
    </div>
  );
};

export default FileUploadList;
