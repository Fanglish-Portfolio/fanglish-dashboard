import React from "react";
import { Menu, Bell, User } from "lucide-react";

export default function Header({ onMenuToggle }) {
  const getPageTitle = () => {
    const path = window.location.pathname;
    switch (path) {
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
      default:
        return "Dashboard";
    }
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

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
