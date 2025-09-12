import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Banners from "./pages/Banners";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Settings from "./pages/Settings";
import ServiceCategory from "./pages/ServiceCategory";
import ServiceDetailPage from "./components/ServiceCategory/ServiceDetailPage";
import BlogCategory from "./pages/BlogCategory";
import BlogDetailPage from "./components/BlogCategory/BlogDetailPage";
import PackageCategory from "./pages/PackageCategory";
import PackageDetailPage from "./components/PackageCategory/PackageDetailPage";
import LanguageClass from "./pages/LanguageClass";
import LanguageClassDetailPage from "./components/LanguageClass/LanguageClassDetailPage";
import Testimonials from "./pages/Testimonials";
import FormDataPage from "./pages/FormData";
import StudyAbroad from "./pages/StudyAbroad";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/banners" />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/service-category" element={<ServiceCategory />} />
            <Route path="/service/:id" element={<ServiceDetailPage />} />
            <Route path="/blog-category" element={<BlogCategory />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/package-category" element={<PackageCategory />} />
            <Route path="/package/:id" element={<PackageDetailPage />} />
            <Route path="/language-class" element={<LanguageClass />} />
            <Route
              path="/language-class/:id"
              element={<LanguageClassDetailPage />}
            />
            <Route path="/users" element={<Users />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content" element={<Content />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/form-data" element={<FormDataPage />} />
            <Route path="/study-abroad" element={<StudyAbroad />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} />
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
