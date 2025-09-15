import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Filter,
  Mail,
  RefreshCw,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import { formDataService } from "../../services/formDataService";
import FormDataDetailModal from "./FormDataDetailModal";
import ConfirmModal from "../UI/ConfirmModal";

export default function FormDataList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [read, setRead] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFormData, setSelectedFormData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    item: null,
    isLoading: false,
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const { items } = await formDataService.getAll();
      setItems(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch form data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((it) => {
      const matchSearch =
        it.name?.toLowerCase().includes(q) ||
        it.email?.toLowerCase().includes(q) ||
        it.text?.toLowerCase().includes(q);
      const matchType = type === "all" ? true : it.type === type;
      const matchRead =
        read === "all" ? true : read === "read" ? it.isRead : !it.isRead;
      const matchTab = activeTab === "all" ? true : it.type === activeTab;
      return matchSearch && matchType && matchRead && matchTab;
    });
  }, [items, search, type, read, activeTab]);

  const handleViewDetails = async (formData) => {
    setSelectedFormData(formData);
    setIsModalOpen(true);

    // Mark as read if it's currently unread
    if (!formData.isRead) {
      try {
        await formDataService.updateReadStatus(formData._id, true);
        // Update local state
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === formData._id ? { ...item, isRead: true } : item
          )
        );
      } catch (error) {
        console.error("Failed to mark as read:", error);
        // Don't show error to user as it's not critical
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFormData(null);
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirm({
      isOpen: true,
      item,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.item) return;

    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));

    try {
      await formDataService.delete(deleteConfirm.item._id);
      await fetchAll();
      setDeleteConfirm({
        isOpen: false,
        item: null,
        isLoading: false,
      });
    } catch (error) {
      setError(error.message);
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      isOpen: false,
      item: null,
      isLoading: false,
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading form data
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
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "all", label: "All Forms", count: items.length },
            {
              id: "request",
              label: "Requests",
              count: items.filter((item) => item.type === "request").length,
            },
            {
              id: "feedback",
              label: "Feedback",
              count: items.filter((item) => item.type === "feedback").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="feedback">Feedback</option>
              <option value="request">Request</option>
            </select>
            <select
              value={read}
              onChange={(e) => setRead(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.type === "feedback"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {row.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {row.contactNumber || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                      <span className="truncate" title={row.text}>
                        {row.text.length > 50
                          ? `${row.text.substring(0, 50)}...`
                          : row.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.isRead ? (
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                          Read
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FormDataDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={selectedFormData}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Form Data"
        message={`Are you sure you want to delete this ${
          deleteConfirm.item?.type || "form"
        } from ${
          deleteConfirm.item?.name || "this user"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteConfirm.isLoading}
        type="danger"
      />
    </div>
  );
}
