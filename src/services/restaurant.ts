import api from "../lib/axios";

// Restaurant Settings API Service
export const restaurantApi = {
  // Get restaurant config
  getConfig: async () => {
    const response = await api.get("/api/restaurant/config");
    return response.data;
  },

  // Update restaurant config
  updateConfig: async (formData: FormData) => {
    const response = await api.put("/api/restaurant/config", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update specific config field
  updateConfigField: async (
    field: string,
    value: string | number | boolean
  ) => {
    const response = await api.put("/api/restaurant/config", {
      [field]: value,
    });
    return response.data;
  },
};
