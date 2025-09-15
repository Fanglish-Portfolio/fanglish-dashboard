import React, { useState, useEffect } from "react";
import { studyAbroadService } from "../../services/studyAbroadService";
import StudyAbroadForm from "./StudyAbroadForm";
import ConfirmModal from "../UI/ConfirmModal";
import {
  ExternalLink,
  MapPin,
  Building2,
  Edit,
  Trash2,
  Plus,
  Filter,
  X,
} from "lucide-react";

export default function StudyAbroadList() {
  const [allUniversities, setAllUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUniversity, setDeletingUniversity] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [availableCountries, setAvailableCountries] = useState([]);

  useEffect(() => {
    fetchAllUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [allUniversities, selectedCountry]);

  const fetchAllUniversities = async () => {
    try {
      setLoading(true);
      const response = await studyAbroadService.getAllUniversities(1, 1000);
      setAllUniversities(response.data);
      setError(null);

      // Extract unique countries from the data
      const countries = [
        ...new Set(response.data.map((uni) => uni.country)),
      ].sort();
      setAvailableCountries(countries);
    } catch (err) {
      setError("Failed to fetch universities");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterUniversities = () => {
    if (!selectedCountry) {
      setFilteredUniversities(allUniversities);
    } else {
      const filtered = allUniversities.filter(
        (university) => university.country === selectedCountry
      );
      setFilteredUniversities(filtered);
    }
  };

  const handleDeleteClick = (university) => {
    setDeletingUniversity(university);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUniversity) return;

    setDeleteLoading(true);
    try {
      await studyAbroadService.deleteUniversity(deletingUniversity._id);
      fetchAllUniversities();
      setIsDeleteModalOpen(false);
      setDeletingUniversity(null);
    } catch (err) {
      setError("Failed to delete university");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingUniversity(null);
  };

  const handleCountryFilter = (country) => {
    setSelectedCountry(country);
  };

  const handleClearFilter = () => {
    setSelectedCountry("");
  };

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    setIsFormOpen(true);
  };

  const handleEditUniversity = (university) => {
    setEditingUniversity(university);
    setIsFormOpen(true);
  };

  const handleSaveUniversity = async (formData) => {
    try {
      if (editingUniversity) {
        await studyAbroadService.updateUniversity(
          editingUniversity._id,
          formData
        );
      } else {
        await studyAbroadService.createUniversity(formData);
      }
      fetchAllUniversities();
    } catch (err) {
      setError("Failed to save university");
      throw err;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUniversity(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAllUniversities}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"></div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            {/* <Filter size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by country:
            </span> */}
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {selectedCountry && (
              <button
                onClick={handleClearFilter}
                className="flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleAddUniversity}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="" />
            <span className="hidden md:block ms-2"> Add University</span>
          </button>
        </div>

        {/* {selectedCountry && (
          <div className="text-sm text-gray-600">
            Showing universities from:{" "}
            <span className="font-medium text-gray-900">{selectedCountry}</span>
          </div>
        )} */}
      </div>

      <div className="flex flex-wrap gap-6">
        {filteredUniversities.map((university) => (
          <div
            key={university._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="bg-gray-200 relative">
              {university.image?.url ? (
                <img
                  src={university.image.url}
                  alt={university.name}
                  className="w-[320px] h-[300px] object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {university.name}
              </h3>

              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{university.country}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <Building2 size={16} className="mr-1" />
                <span className="text-sm capitalize">{university.type}</span>
              </div>

              {university.url && (
                <a
                  href={university.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mb-3"
                >
                  <ExternalLink size={14} className="mr-1" />
                  Visit Website
                </a>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditUniversity(university)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(university)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Previous
          </button>

          <span className="px-3 py-2 bg-blue-600 text-white rounded">
            {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )} */}

      {filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No universities found
          </h3>
          <p className="text-gray-600">
            Get started by adding your first university.
          </p>
        </div>
      )}

      <StudyAbroadForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUniversity}
        university={editingUniversity}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete University"
        message={`Are you sure you want to delete "${deletingUniversity?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        type="danger"
      />
    </div>
  );
}
