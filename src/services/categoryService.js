import axios from "axios";
import api from "../api/axios.js";

export const categoryService = {
  async getAllCategories() {
    try {
      const response = await api.get("/service-categories");
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching service categories:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch service categories"
        );
      }
      throw error;
    }
  },

  async createCategory(data) {
    try {
      const formData = new FormData();
      if (data?.image) formData.append("image", data.image);
      if (data?.title) formData.append("title", data.title);
      if (data?.text) formData.append("text", data.text);
      if (data?.serviceCategory)
        formData.append("serviceCategory", data.serviceCategory);

      const response = await api.post("/service-categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data?.data;
    } catch (error) {
      console.error("Error creating service category:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create service category"
        );
      }
      throw error;
    }
  },

  async updateCategory(id, data) {
    try {
      const formData = new FormData();
      if (data?.image) formData.append("image", data.image);
      if (data?.title) formData.append("title", data.title);
      if (data?.text) formData.append("text", data.text);
      if (data?.serviceCategory)
        formData.append("serviceCategory", data.serviceCategory);

      const response = await api.patch(`/service-categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data?.data;
    } catch (error) {
      console.error("Error updating service category:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update service category"
        );
      }
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/service-categories/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching service category:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch service category"
        );
      }
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      await api.delete(`/service-categories/${id}`);
    } catch (error) {
      console.error("Error deleting service category:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete service category"
        );
      }
      throw error;
    }
  },
};

// Backward-compatible named exports
export const createServiceCategory = (data) =>
  categoryService.createCategory(data);
export const getServiceCategories = () => categoryService.getAllCategories();
export const updateServiceCategory = (id, data) =>
  categoryService.updateCategory(id, data);
export const getServiceCategoryById = (id) =>
  categoryService.getCategoryById(id);
export const deleteServiceCategory = (id) => categoryService.deleteCategory(id);
