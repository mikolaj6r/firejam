import React from "react";

const skeleton = () => (
  <div className="animate-pulse flex space-x-4 my-4">
    <div className="rounded-full bg-purple-400 h-12 w-12"></div>
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-purple-400 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-purple-400 rounded"></div>
        <div className="h-4 bg-purple-400 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

export default function Loader() {
  return (
    <div className="border-2 border-purple-600 border-dashed shadow rounded-md p-4 my-16 w-full mx-auto">
      {skeleton()}
      {skeleton()}
      {skeleton()}
    </div>
  );
}
