import api from "../lib/axios";

// Menu Items API Service
export const menuItemsApi = {
  // Get all menu items
  getAll: async (params?: {
    categoryId?: number;
    isVegetarian?: boolean;
    isAvailable?: boolean;
  }) => {
    const response = await api.get("/api/menu-items", { params });
    return response.data;
  },

  // Get menu item by ID
  getById: async (id: number) => {
    const response = await api.get(`/api/menu-items/${id}`);
    return response.data;
  },

  // Create menu item
  create: async (formData: FormData) => {
    const response = await api.post("/api/menu-items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update menu item
  update: async (id: number, formData: FormData) => {
    const response = await api.put(`/api/menu-items/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Toggle availability
  toggleAvailability: async (id: number) => {
    const response = await api.patch(
      `/api/menu-items/${id}/toggle-availability`
    );
    return response.data;
  },

  // Toggle vegetarian status
  toggleVegetarian: async (id: number) => {
    const response = await api.patch(`/api/menu-items/${id}/toggle-vegetarian`);
    return response.data;
  },

  // Delete menu item
  delete: async (id: number) => {
    const response = await api.delete(`/api/menu-items/${id}`);
    return response.data;
  },
};
