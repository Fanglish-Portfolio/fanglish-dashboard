import api from "../api/axios";

export const studyAbroadService = {
  getAllUniversities: async (page = 1, limit = 10, country = null) => {
    try {
      let url = `study-abroad?page=${page}&limit=${limit}`;
      if (country) {
        url += `&country=${encodeURIComponent(country)}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching universities:", error);
      throw error;
    }
  },

  getUniversityById: async (id) => {
    try {
      const response = await api.get(`/study-abroad/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching university:", error);
      throw error;
    }
  },

  createUniversity: async (universityData) => {
    try {
      const formData = new FormData();
      formData.append("name", universityData.name);
      formData.append("country", universityData.country);
      formData.append("type", universityData.type);
      formData.append("url", universityData.url);
      if (universityData.image) {
        formData.append("image", universityData.image);
      }

      const response = await api.post("/study-abroad", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating university:", error);
      throw error;
    }
  },

  updateUniversity: async (id, universityData) => {
    try {
      const formData = new FormData();
      formData.append("name", universityData.name);
      formData.append("country", universityData.country);
      formData.append("type", universityData.type);
      formData.append("url", universityData.url);
      if (universityData.image) {
        formData.append("image", universityData.image);
      }

      const response = await api.patch(`/study-abroad/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating university:", error);
      throw error;
    }
  },

  deleteUniversity: async (id) => {
    try {
      const response = await api.delete(`/study-abroad/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting university:", error);
      throw error;
    }
  },
};
