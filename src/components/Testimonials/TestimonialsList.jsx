import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { testimonialService } from "../../services/testimonialService";
import TestimonialModal from "./TestimonialModal";
import ConfirmModal from "../UI/ConfirmModal";

export default function TestimonialsList() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
    isDeleting: false,
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testimonialService.getAll();
      setItems(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch testimonials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const next = items.filter((t) => {
      return (
        t.name?.toLowerCase().includes(q) ||
        t.university?.toLowerCase().includes(q) ||
        t.program?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    });
    setFiltered(next);
  }, [items, search]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading testimonials
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAll}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Testimonial
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No testimonials found</div>
          <div className="text-sm text-gray-500">Try adjusting your search</div>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={t.image?.url}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.university} • {t.program}
                    </div>
                  </div>
                </div>

                {t.description && (
                  <div className="text-gray-700 mb-3">{t.description}</div>
                )}

                {t.text && (
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: t.text }}
                  />
                )}

                {t.youtubeLink && (
                  <a
                    href={t.youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Watch on YouTube
                  </a>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <Edit2 size={14} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        isOpen: true,
                        id: t._id,
                        isDeleting: false,
                      })
                    }
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        testimonial={editing}
        isLoading={isSubmitting}
        onSave={async (_formData, raw) => {
          try {
            setIsSubmitting(true);
            if (editing) {
              await testimonialService.update(editing._id, raw);
            } else {
              await testimonialService.create(raw);
            }
            await fetchAll();
            setIsModalOpen(false);
            setEditing(null);
          } catch (err) {
            alert(
              err instanceof Error ? err.message : "Failed to save testimonial"
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() =>
          setConfirmDelete({ isOpen: false, id: null, isDeleting: false })
        }
        onConfirm={async () => {
          if (!confirmDelete.id) return;
          try {
            setConfirmDelete((s) => ({ ...s, isDeleting: true }));
            await testimonialService.delete(confirmDelete.id);
            await fetchAll();
            setConfirmDelete({ isOpen: false, id: null, isDeleting: false });
          } catch (err) {
            alert(
              err instanceof Error
                ? err.message
                : "Failed to delete testimonial"
            );
            setConfirmDelete((s) => ({ ...s, isDeleting: false }));
          }
        }}
        isLoading={confirmDelete.isDeleting}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
