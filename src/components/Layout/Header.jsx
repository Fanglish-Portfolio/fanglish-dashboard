import React, { useState } from "react";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/banners":
        return "Banner Management";
      case "/users":
        return "User Management";
      case "/analytics":
        return "Analytics";
      case "/content":
        return "Content Management";
      case "/settings":
        return "Settings";
      case "/service-category":
        return "Service Category";
      case "/blog-category":
        return "Blog Category";
      case "/package-category":
        return "Package Category";
      case "/language-class":
        return "Language Class";
      case "/testimonials":
        return "Testimonials";
      case "/form-data":
        return "Form Data";
      case "/study-abroad":
        return "Study Abroad";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "Admin"}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "admin@funglish.com"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
