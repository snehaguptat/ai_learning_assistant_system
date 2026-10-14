import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-canvas border-r border-line z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand + mobile close */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-accent-fg">
              <BrainCircuit size={20} strokeWidth={2.25} />
            </div>
            <div className="leading-none">
              <h1 className="font-display text-[15px] font-semibold text-fg">
                Learning Assistant
              </h1>
              <p className="eyebrow text-[10px]! mt-1">AI · Study</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-fg-muted hover:text-fg"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <p className="eyebrow px-3 mb-3">Workspace</p>
          <div className="space-y-1">
            {navLinks.map((link) => {
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 h-10 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-fg-muted hover:bg-raised hover:text-fg"
                    }`
                  }
                >
                  {({ isActive }) => {
                    return (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-accent" />
                        )}
                        <link.icon size={18} strokeWidth={2} />
                        {link.text}
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-line">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-3 h-10 text-sm font-medium text-fg-muted hover:bg-danger/10 hover:text-danger rounded-lg transition-colors duration-150"
          >
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
