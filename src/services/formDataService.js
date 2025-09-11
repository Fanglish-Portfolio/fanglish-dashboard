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
};
