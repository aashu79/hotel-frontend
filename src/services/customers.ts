import api from "../lib/axios";

// Customer Management API Service
export const customersApi = {
  // Get all customers
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get("/api/admin/customers", { params });
    return response.data;
  },

  // Delete customer
  delete: async (id: string) => {
    const response = await api.delete(`/api/admin/customers/${id}`);
    return response.data;
  },
};
