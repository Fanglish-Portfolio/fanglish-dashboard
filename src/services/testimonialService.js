import axios from "axios";
import api from "../api/axios.js";

export const testimonialService = {
  async getAll() {
    try {
      const response = await api.get("/testimonials");
      // API shape: { success, message, data: [ ... ] } OR sometimes single object
      const result = response.data;
      return Array.isArray(result.data)
        ? result.data
        : [result.data].filter(Boolean);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch testimonials"
        );
      }
      throw error;
    }
  },
  async create(data) {
    try {
      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("university", data.university || "");
      formData.append("program", data.program || "");
      if (data.text) formData.append("text", data.text);
      if (data.youtubeLink) formData.append("youtubeLink", data.youtubeLink);

      const response = await api.post("/testimonials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to create testimonial"
        );
      }
      throw error;
    }
  },
  async update(id, data) {
    // console.log(data);
    try {
      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("university", data.university || "");
      formData.append("program", data.program || "");
      if (data.text) formData.append("text", data.text);
      if (data.youtubeLink) formData.append("youtubeLink", data.youtubeLink);

      // console.log("formData.get(program)", formData.get("program"));

      const response = await api.patch(`/testimonials/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update testimonial"
        );
      }
      throw error;
    }
  },
  async delete(id) {
    try {
      await api.delete(`/testimonials/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete testimonial"
        );
      }
      throw error;
    }
  },
};
