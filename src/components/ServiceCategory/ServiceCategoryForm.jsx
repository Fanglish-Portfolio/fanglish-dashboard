import React, { useState } from "react";
import { Upload, X, Save, AlertCircle, CheckCircle } from "lucide-react";
import {
  createServiceCategory,
  updateServiceCategory,
} from "../../services/categoryService";
import TextEditor from "./TextEditor";

const ServiceCategoryForm = ({ onClose, onSuccess, editData = null }) => {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    text: editData?.text || "",
    serviceCategory: editData?.serviceCategory || "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(
    editData?.image?.imageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text || !formData.serviceCategory || !formData.title) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editData && !formData.image) {
      setError("Please select an image");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        image: formData.image,
        title: formData.title,
        text: formData.text,
        serviceCategory: formData.serviceCategory,
      };

      if (editData) {
        await updateServiceCategory(editData._id, data);
      } else {
        await createServiceCategory(data);
      }
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create service category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? "Edit" : "Create"} Service Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter title for the service category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Service Category Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category *
            </label>
            <input
              type="text"
              value={formData.serviceCategory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  serviceCategory: e.target.value,
                }))
              }
              placeholder="e.g., blog, tutorial, guide"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Text Content Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <TextEditor
                content={formData.text}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, text: content }))
                }
                placeholder="Enter your content here..."
                compact={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use the rich text editor to format your content with headings,
              bold text, lists, and more. HTML tags will be preserved.
            </p>
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {!editData && "*"}
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </label>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={!editData}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle size={16} />
              <span className="text-sm">
                Service category {editData ? "updated" : "created"}{" "}
                successfully!
              </span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              <span>
                {isSubmitting
                  ? editData
                    ? "Updating..."
                    : "Creating..."
                  : editData
                  ? "Update Category"
                  : "Create Category"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCategoryForm;
