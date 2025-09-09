import React from "react";
import { Edit, Trash2, Calendar } from "lucide-react";

export default function BannerCard({ banner, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={banner.imageUrl}
          alt="Banner"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>Created {formatDate(banner.createdAt)}</span>
        </div>

        <div className="text-xs text-gray-400 mb-4 break-all">
          ID: {banner._id}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
            Active
          </span>

          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => onEdit(banner)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Banner"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => onDelete(banner._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Banner"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
