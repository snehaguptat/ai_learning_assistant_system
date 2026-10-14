import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const initial = (user?.username || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-canvas/70 backdrop-blur-md border-b border-line">
      <div className="flex items-center justify-between h-full px-5 md:px-10">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden btn btn-ghost px-0! w-10"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="hidden md:block"></div>

        <div className="flex items-center gap-2">
          <button
            className="relative btn btn-ghost px-0! w-10 group"
            aria-label="Notifications"
          >
            <Bell
              size={18}
              strokeWidth={2}
              className="group-hover:rotate-12 transition-transform duration-200"
            />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full ring-2 ring-canvas" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 ml-2 border-l border-line">
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-display font-semibold text-sm">
              {initial}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium text-fg">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-fg-subtle">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
