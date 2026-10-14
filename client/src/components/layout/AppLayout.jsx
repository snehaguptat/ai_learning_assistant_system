import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-screen bg-canvas text-fg">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Ember glow behind the page header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-ember" />
        <Header toggleSidebar={toggleSidebar} />
        <main className="relative flex-1 overflow-x-hidden overflow-y-auto px-5 py-8 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
