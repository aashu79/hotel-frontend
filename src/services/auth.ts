import axios from "axios";

// Auth API Service
export const authApi = {
  // Customer Login (OTP based)
  sendLoginOtp: async (phoneNumber: string) => {
    const response = await axios.post("/api/auth/customer/login/send-otp", {
      phoneNumber,
    });
    return response.data;
  },

  verifyLoginOtp: async (identifier: string, otp: string) => {
    const response = await axios.post("/api/auth/customer/login/verify-otp", {
      identifier,
      otp,
    });
    return response.data;
  },

  // Customer Registration (OTP based)
  sendRegisterOtp: async (name: string, phoneNumber: string) => {
    const response = await axios.post("/api/auth/customer/register/send-otp", {
      name,
      phoneNumber,
    });
    return response.data;
  },

  verifyRegisterOtp: async (identifier: string, otp: string) => {
    const response = await axios.post(
      "/api/auth/customer/register/verify-otp",
      { identifier, otp }
    );
    return response.data;
  },

  // Staff/Admin Login (Email/Password based)
  staffLogin: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/staff/login", {
      email,
      password,
    });
    return response.data;
  },

  // Staff/Admin Registration
  registerStaffAdmin: async (
    name: string,
    email: string,
    password: string,
    role: "STAFF" | "ADMIN"
  ) => {
    const response = await axios.post("/api/auth/staff/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get("/api/auth/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: {
    name?: string;
    phoneNumber?: string;
    email?: string;
  }) => {
    const response = await axios.put("/api/auth/profile", data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axios.put("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post("/api/auth/logout");
    return response.data;
  },
};
