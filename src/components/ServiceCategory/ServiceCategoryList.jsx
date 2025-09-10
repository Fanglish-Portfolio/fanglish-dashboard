import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Plus, Calendar, Eye, Trash2 } from "lucide-react";
import {
  getServiceCategories,
  deleteServiceCategory,
} from "../../services/categoryService";
import ConfirmModal from "../UI/ConfirmModal";
import ServiceCategoryForm from "./ServiceCategoryForm";

const ServiceCategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState(0);
  const [deleteState, setDeleteState] = useState({
    open: false,
    id: null,
    loading: false,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceCategories();
      // console.log(data);
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch service categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categoryRefreshTrigger]);

  const handleViewDetail = (category) => {
    navigate(`/service/${category._id}`);
  };

  const handleCategorySuccess = () => {
    setCategoryRefreshTrigger((prev) => prev + 1);
    setShowCategoryForm(false);
  };

  const openDelete = (id) => setDeleteState({ open: true, id, loading: false });
  const closeDelete = () =>
    setDeleteState({ open: false, id: null, loading: false });
  const confirmDelete = async () => {
    if (!deleteState.id) return;
    try {
      setDeleteState((s) => ({ ...s, loading: true }));
      await deleteServiceCategory(deleteState.id);
      closeDelete();
      fetchCategories();
    } catch (err) {
      // Simple alert to stay concise
      alert(
        err instanceof Error ? err.message : "Failed to delete service category"
      );
      setDeleteState((s) => ({ ...s, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <RefreshCw className="animate-spin" size={20} />
          <span>Loading service categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchCategories}
          className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Service Categories
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your service categories and content
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCategories}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>New Category</span>
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="mx-auto text-gray-300 mb-4">
              <svg
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No service categories yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first service category to get started
            </p>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Create First Category</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {category.image?.imageUrl && (
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={category.image.imageUrl}
                      alt={category.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <div class="text-gray-400">
                                <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {category.serviceCategory}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {category.title || "Untitled"}
                  </h3>

                  <div className="flex items-center justify-between">
                    {category.createdAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(category)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => openDelete(category._id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Category Form Modal */}
      {showCategoryForm && (
        <ServiceCategoryForm
          category="consultation"
          onClose={() => setShowCategoryForm(false)}
          onSuccess={handleCategorySuccess}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteState.open}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        isLoading={deleteState.loading}
        title="Delete service category"
        message="This action cannot be undone. The category will be permanently removed."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ServiceCategoryList;
