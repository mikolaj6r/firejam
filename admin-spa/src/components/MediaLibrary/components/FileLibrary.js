import React, { useState } from "react";
import FileLibraryCard from "./FileLibraryCard";

import { Button, Pagination } from "@windmill/react-ui";

const FileLibrary = (props) => {
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  function sortArray(a, b) {
    try {
      const property = props.sortProperty;
      let valA = property !== undefined ? a[property] : 0;
      let valB = property !== undefined ? b[property] : 0;

      // If string, ignore upper and lowercase
      if (typeof valA === "string") valA = valA.toUpperCase();
      if (typeof valB === "string") valB = valB.toUpperCase();

      if (props.sortAscending) {
        return valA < valB ? -1 : 1;
      } else {
        return valA > valB ? -1 : 1;
      }
    } catch {
      return 0;
    }
  }

  function renderList() {
    if (!props.fileLibraryList) return [];

    const arrayStart = (page - 1) * itemsPerPage;
    let arrayEnd = arrayStart + itemsPerPage;
    if (arrayEnd > props.fileLibraryList.length) {
      // If calculated end extends past length of actual array
      // Set calculated end as length of array
      arrayEnd = props.fileLibraryList.length;
    }

    return [...props.fileLibraryList]
      .sort(sortArray)
      .slice(arrayStart, arrayEnd)
      .map((element, index) => {
        return (
          <React.Fragment key={element.fileName}>
            {React.createElement(props.libraryCardComponent, {
              selectedItem,
              ...element,
              onClick(e) {
                e.preventDefault();
                e.stopPropagation();
                setSelectedItem(element);
              },
            })}
          </React.Fragment>
        );
      });
  }

  const submitRow = selectedItem && (
    <div className="flex flex-row mt-4 mb-2">
      <div className="text-right flex-initial">
        {props.fileDeleteCallback !== undefined && (
          <Button
            layout="outline"
            onClick={() => {
              if (props.fileDeleteCallback)
                props.fileDeleteCallback(selectedItem);
            }}
            className="mr-3"
          >
            Delete
          </Button>
        )}
        {!props.isModal && (
          <Button
            layout="primary"
            onClick={() =>
              navigator.clipboard.writeText(selectedItem.thumbnailUrl)
            }
          >
            Copy link
          </Button>
        )}
        {props.isModal !== undefined && (
          <Button
            layout="primary"
            onClick={() => props.fileSelectCallback(selectedItem)}
          >
            Select File
          </Button>
        )}
      </div>
    </div>
  );

  const pagerRow = props.fileLibraryList.length > itemsPerPage && (
    <div className="flex flex-row">
      <div className="d-flex justify-center flex-initial">
        <Pagination
          totalResults={props.fileLibraryList.length}
          resultsPerPage={itemsPerPage}
          onChange={(number) => setPage(number)}
          label="Page navigation"
        />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div
        className="flex flex-row flex-wrap justify-start items-stretch mt-16  mb-4 gap-6"
        onClick={() => {
          setSelectedItem(undefined);
        }}
      >
        {renderList()}
      </div>
      {pagerRow}
      {submitRow}
    </React.Fragment>
  );
};

FileLibrary.defaultProps = {
  sortProperty: "createdAt",
  sortAscending: false,
  libraryCardComponent: FileLibraryCard,
};

export default FileLibrary;
