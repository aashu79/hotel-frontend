import api from "../lib/axios";

// Menu Categories API Service
export const menuCategoriesApi = {
  // Get all menu categories
  getAll: async (params?: { includeInactive?: boolean }) => {
    const queryParams = params?.includeInactive ? "?includeInactive=true" : "";
    const response = await api.get(`/api/menu-categories${queryParams}`);
    return response.data;
  },

  // Create menu category
  create: async (data: {
    name: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => {
    const response = await api.post("/api/menu-categories", data);
    return response.data;
  },

  // Update menu category
  update: async (
    id: number,
    data: {
      name: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) => {
    const response = await api.put(`/api/menu-categories/${id}`, data);
    return response.data;
  },

  // Toggle category status
  toggleStatus: async (id: number) => {
    const response = await api.patch(
      `/api/menu-categories/${id}/toggle-status`
    );
    return response.data;
  },

  // Delete menu category
  delete: async (id: number) => {
    const response = await api.delete(`/api/menu-categories/${id}`);
    return response.data;
  },
};
