import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Edit } from "lucide-react";
import { getServiceCategoryById } from "../../services/categoryService";
import BlogCategoryForm from "./BlogCategoryForm";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServiceCategoryById(id);
      setCategory(response.data || response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch service category"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleBack = () => {
    navigate("/blog-category");
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    fetchCategory(); // Refresh the data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading service category...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Blog category not found</div>
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Blog Categories</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit size={16} />
              <span>Edit Blog Category</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              <Tag size={14} className="inline mr-1" />
              {category.serviceCategory}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category.title || "Untitled Service"}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>
            {category.updatedAt !== category.createdAt && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Updated: {new Date(category.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        {category.image?.imageUrl && (
          <div className="mb-8">
            <img
              src={category.image.imageUrl}
              alt={category.title}
              className="w-full max-h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <div class="text-gray-400 text-center">
                        <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" class="mx-auto mb-2">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <p>Image not available</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: category.text }}
          />
        </div>

        {/* Metadata */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Service Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service ID
              </label>
              <p className="text-sm text-gray-600 font-mono">{category._id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="text-sm text-gray-600">
                {category.serviceCategory}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Date
              </label>
              <p className="text-sm text-gray-600">
                {new Date(category.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-600">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <BlogCategoryForm
          category="blog"
          onClose={() => setShowEditForm(false)}
          onSuccess={handleEditSuccess}
          editData={category}
        />
      )}
    </div>
  );
};

export default ServiceDetailPage;
