import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <div className="relative border-b border-line overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative h-11 px-4 md:px-5 text-sm font-medium transition-colors duration-150 ${
                  isActive ? "text-fg" : "text-fg-subtle hover:text-fg-muted"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className="animate-fade-in">
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
