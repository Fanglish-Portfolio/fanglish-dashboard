import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  Users,
  Settings,
  BarChart3,
  FileText,
  Menu,
  X,
  Layers,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "banners", label: "Banners", icon: Image, path: "/banners" },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: Image,
    path: "/testimonials",
  },
  // { id: "users", label: "Users", icon: Users, path: "/users" },
  {
    id: "service-category",
    label: "Service Category",
    icon: Layers,
    path: "/service-category",
  },
  {
    id: "blog-category",
    label: "Blog Category",
    icon: Layers,
    path: "/blog-category",
  },
  {
    id: "package-category",
    label: "Package Category",
    icon: Layers,
    path: "/package-category",
  },
  {
    id: "language-class",
    label: "Language Class",
    icon: Layers,
    path: "/language-class",
  },
  {
    id: "study-abroad",
    label: "Study Abroad",
    icon: GraduationCap,
    path: "/study-abroad",
  },
  // { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  // { id: "content", label: "Content", icon: FileText, path: "/content" },
  { id: "form-data", label: "Form Data", icon: FileText, path: "/form-data" },
  // { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`
        fixed left-0 top-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Funglish Admin</h1>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-r-2 border-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">admin@funglish.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
