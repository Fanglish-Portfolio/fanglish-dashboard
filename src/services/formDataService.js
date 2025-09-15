import axios from "axios";
import api from "../api/axios.js";

export const formDataService = {
  async getAll(params = {}) {
    try {
      const response = await api.get("/form-data", { params });
      const result = response.data;
      return {
        items: Array.isArray(result.data) ? result.data : [],
        pagination: result.pagination || null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch form data"
        );
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/form-data/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete form data"
        );
      }
      throw error;
    }
  },

  async updateReadStatus(id, isRead) {
    try {
      const response = await api.patch(`/form-data/${id}`, { isRead });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update form data status"
        );
      }
      throw error;
    }
  },
};
