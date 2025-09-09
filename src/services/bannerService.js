import axios from "axios";
import api from "../api/axios.js";

export const bannerService = {
  async getAllBanners() {
    try {
      const response = await api.get("/banners");
      const result = response.data;

      return result.data;
    } catch (error) {
      console.error("Error fetching banners:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch banners"
        );
      }
      throw error;
    }
  },

  async createBanner(data) {
    try {
      const formData = new FormData();
      formData.append("image", data.image);

      const response = await api.post("/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error creating banner:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create banner"
        );
      }
      throw new Error("Create API endpoint not provided yet");
    }
  },

  async updateBanner(id, data) {
    try {
      const formData = new FormData();
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await api.put(`/banners/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating banner:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update banner"
        );
      }
      throw new Error("Update API endpoint not provided yet");
    }
  },

  async deleteBanner(id) {
    try {
      await api.delete(`/banners/${id}`);
    } catch (error) {
      console.error("Error deleting banner:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete banner"
        );
      }
      throw new Error("Delete API endpoint not provided yet");
    }
  },
};
