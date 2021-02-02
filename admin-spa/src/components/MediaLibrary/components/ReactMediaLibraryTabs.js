import * as React from "react";
import FileUpload from "./FileUpload";
import FileLibrary from "./FileLibrary";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ReactMediaLibraryTabs = (props) => {
  return (
    <Tabs
      defaultActiveKey="upload"
      id="react-media-library-tabs"
      selectedTabClassName="bg-indigo-600 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium"
      className="mt-4 text-gray-900 "
    >
      <TabList className="inline-flex flex-row bg-white pl-2 py-1 pr-16 rounded-md">
        <Tab
          eventKey="upload"
          className="mx-1 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
        >
          Upload
        </Tab>
        {Array.isArray(props.fileLibraryList) &&
          props.fileLibraryList.length > 0 && (
            <Tab
              eventKey="library"
              className="mx-1  hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Library
            </Tab>
          )}
      </TabList>
      <TabPanel>
        <div className="container mx-auto mt-12">
          <FileUpload fileUploadCallback={props.fileUploadCallback} />
        </div>
      </TabPanel>
      <TabPanel>
        {Array.isArray(props.fileLibraryList) &&
          props.fileLibraryList.length > 0 && (
            <FileLibrary
              fileLibraryList={props.fileLibraryList}
              fileSelectCallback={props.fileSelectCallback}
              fileDeleteCallback={props.fileDeleteCallback}
              libraryCardComponent={props.libraryCardComponent}
              isModal={props.isModal}
            />
          )}
      </TabPanel>
    </Tabs>
  );
};

export default ReactMediaLibraryTabs;
