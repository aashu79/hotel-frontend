import api from "../lib/axios";

// Staff Management API Service
export const staffApi = {
  // Get all staff
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get("/api/auth/users/staff", { params });
    return response.data;
  },

  // Create staff
  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }) => {
    const response = await api.post("/api/auth/staff/register", data);
    return response.data;
  },

  // Update staff
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      phone?: string;
      isActive?: boolean;
    }
  ) => {
    const response = await api.put(`/api/admin/staff/${id}`, data);
    return response.data;
  },

  // Delete staff
  delete: async (id: string) => {
    const response = await api.delete(`/api/admin/staff/${id}`);
    return response.data;
  },
};
