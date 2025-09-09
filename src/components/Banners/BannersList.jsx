import React, { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, RefreshCw } from "lucide-react";
import BannerCard from "./BannerCard";
import BannerModal from "./BannerModal";
import ConfirmModal from "../UI/ConfirmModal";
import { bannerService } from "../../services/bannerService";

export default function BannersList() {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    bannerId: null,
    isDeleting: false,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    const filtered = banners.filter(
      (banner) =>
        banner._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.imageUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBanners(filtered);
  }, [banners, searchTerm]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bannerService.getAllBanners();
      setBanners(data.reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDeleteBanner = async (id) => {
    setConfirmModal({
      isOpen: true,
      bannerId: id,
      isDeleting: false,
    });
  };

  const confirmDeleteBanner = async () => {
    if (!confirmModal.bannerId) return;

    setConfirmModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await bannerService.deleteBanner(confirmModal.bannerId);
      setBanners(
        banners.filter((banner) => banner._id !== confirmModal.bannerId)
      );
      setConfirmModal({ isOpen: false, bannerId: null, isDeleting: false });
    } catch (err) {
      alert(
        "Delete functionality will be available when you provide the delete API endpoint"
      );
      setConfirmModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleSaveBanner = async (formData) => {
    try {
      setIsSubmitting(true);

      if (editingBanner) {
        const updatedBanner = await bannerService.updateBanner(
          editingBanner._id,
          {
            image: formData.get("image"),
          }
        );
        setBanners(
          banners.map((b) => (b._id === editingBanner._id ? updatedBanner : b))
        );
      } else {
        const newBanner = await bannerService.createBanner({
          image: formData.get("image"),
        });
        setBanners([newBanner, ...banners]);
      }

      setIsModalOpen(false);
      setEditingBanner(null);
    } catch (err) {
      alert(
        "CRUD operations will be available when you provide the respective API endpoints"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading banners
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchBanners}
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
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCreateBanner}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">
            {banners.length}
          </div>
          <div className="text-sm text-gray-600">Total Banners</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {banners.length}
          </div>
          <div className="text-sm text-gray-600">Active Banners</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {filteredBanners.length}
          </div>
          <div className="text-sm text-gray-600">Filtered Results</div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!isLoading && filteredBanners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No banners found" : "No banners yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first banner"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateBanner}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Add Banner
            </button>
          )}
        </div>
      )}

      {!isLoading && filteredBanners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBanners.map((banner) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              onEdit={handleEditBanner}
              onDelete={handleDeleteBanner}
            />
          ))}
        </div>
      )}

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
        banner={editingBanner}
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, bannerId: null, isDeleting: false })
        }
        onConfirm={confirmDeleteBanner}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={confirmModal.isDeleting}
        type="danger"
      />
    </div>
  );
}
