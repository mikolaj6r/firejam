import React from "react";
import formatBytes from "../utils/formatBytes";
import formatDate from "../utils/formatDate";

import { Card, CardBody } from "@windmill/react-ui";

function ListGroupItem({ children, className }) {
  return (
    <div
      className={`relative block border bl-0 br-0 bb-0 ${className}`}
      style={{ padding: ".75rem 1.25rem", borderColor: "rgba(0,0,0,.125)" }}
    >
      {children}
    </div>
  );
}

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  objectPosition: "50% 50%",
};

const FileLibraryCard = (props) => {
  return (
    <Card
      colored
      className={`min-w-0 rounded-lg shadow-xs overflow-hidden flex-initial w-full md:w-1/3 lg:w-1/4 sm:w-1/2 flex flex-col`}
      onClick={props.onClick}
    >
      {props.thumbnailUrl && (
        <img
          className="object-cover w-1/3"
          src={props.thumbnailUrl}
          style={imgStyle}
        />
      )}
      <div
        className={`list-group-flush text-xs flex-grow flex flex-col pl-0 mb-0 ${
          props.selectedItem !== undefined &&
          props.selectedItem._id === props._id
            ? "bg-indigo-600 text-white"
            : "bg-white text-black"
        }`}
      >
        {props.fileName && (
          <ListGroupItem className="flex-grow">{props.fileName}</ListGroupItem>
        )}
        {props.size && <ListGroupItem>{formatBytes(props.size)}</ListGroupItem>}
        {props.createdAt && (
          <ListGroupItem>{formatDate(props.createdAt)}</ListGroupItem>
        )}
      </div>
    </Card>
  );
};

export default FileLibraryCard;
