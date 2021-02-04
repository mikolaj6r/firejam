import * as React from "react";
import FileUpload from "./FileUpload";
import FileLibrary from "./FileLibrary";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ReactMediaLibraryTabs = (props) => {
  return (
    <Tabs
      id="react-media-library-tabs"
      selectedTabClassName="bg-purple-600 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium"
      className="mt-4 text-gray-900 "
    >
      <TabList className="inline-flex flex-row bg-white pl-2 py-1 pr-16 rounded-md">
        <Tab className="mx-1 hover:bg-purple-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
          Upload
        </Tab>
        {Array.isArray(props.fileLibraryList) &&
          props.fileLibraryList.length > 0 && (
            <Tab className="mx-1  hover:bg-purple-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
              Library
            </Tab>
          )}
        {props.additionalTabs &&
          props.additionalTabs.map(({ name }, index) => {
            return (
              <Tab
                key={`${name}-${index}`}
                className="mx-1  hover:bg-purple-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                {name}
              </Tab>
            );
          })}
      </TabList>
      <TabPanel>
        <div className="container mx-auto mt-12">
          <FileUpload fileUploadCallback={props.fileUploadCallback} />
        </div>
      </TabPanel>
      {Array.isArray(props.fileLibraryList) &&
        props.fileLibraryList.length > 0 && (
          <TabPanel>
            <FileLibrary
              fileLibraryList={props.fileLibraryList}
              fileSelectCallback={props.fileSelectCallback}
              fileDeleteCallback={props.fileDeleteCallback}
              libraryCardComponent={props.libraryCardComponent}
              isModal={props.isModal}
            />
          </TabPanel>
        )}
      {props.additionalTabs &&
        props.additionalTabs.map(({ component: Component }, index) => {
          return (
            <TabPanel key={index}>
              <Component />
            </TabPanel>
          );
        })}
    </Tabs>
  );
};

export default ReactMediaLibraryTabs;
