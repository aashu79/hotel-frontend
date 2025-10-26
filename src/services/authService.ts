import api from "@/utils/api";

class AuthService {
  // ...existing code...

  async registerStaffAdmin(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    locationId?: string;
  }) {
    const response = await api.post("/auth/register-staff-admin", data);
    return response.data;
  }

  // ...existing code...
}

export default new AuthService();
