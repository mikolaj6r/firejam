import React from "react";

import { Windmill } from "@windmill/react-ui";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function LoggedLayout({ children }) {
  return (
    <Windmill usePreferences>
      <section className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Sidebar></Sidebar>
        <div className="flex flex-col flex-1 w-full">
          <Header />
          <main className="h-full overflow-y-auto">
            <div className="container grid px-6 mx-auto">{children}</div>
          </main>
          <footer className="px-6 py-3 border-t flex w-full items-end">
            <p className="text-gray-600">made by @FIREJAM</p>
            <div className="flex-1"></div>
          </footer>
        </div>
      </section>
    </Windmill>
  );
}
