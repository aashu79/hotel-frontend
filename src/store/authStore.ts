import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Customer Login actions (OTP based)
  sendLoginOtp: (phoneNumber: string) => Promise<boolean>;
  verifyLoginOtp: (identifier: string, otp: string) => Promise<boolean>;

  // Customer Registration actions (OTP based)
  sendRegisterOtp: (name: string, phoneNumber: string) => Promise<boolean>;
  verifyRegisterOtp: (identifier: string, otp: string) => Promise<boolean>;

  // Staff/Admin actions (Email/Password based)
  loginStaffAdmin: (email: string, password: string) => Promise<boolean>;
  registerStaffAdmin: (
    name: string,
    email: string,
    password: string,
    role: "STAFF" | "ADMIN"
  ) => Promise<boolean>;

  // Other actions
  logout: () => void;
  clearError: () => void;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:3000", // Replace with your actual API URL
});

// Add authorization header interceptor
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state
    ?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      sendLoginOtp: async (phoneNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/auth/customer/login/send-otp", {
            phoneNumber,
          });
          set({ isLoading: false });
          return response.data.success;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to send OTP";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      verifyLoginOtp: async (identifier: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(
            "/api/auth/customer/login/verify-otp",
            {
              identifier,
              otp,
            }
          );

          const { token, user } = response.data;
          set({
            isLoading: false,
            isAuthenticated: true,
            token,
            user,
          });
          return true;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to send OTP";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      sendRegisterOtp: async (name: string, phoneNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(
            "/api/auth/customer/register/send-otp",
            {
              name,
              phoneNumber,
            }
          );
          set({ isLoading: false });
          return response.data.success;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to send OTP";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      verifyRegisterOtp: async (identifier: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(
            "/api/auth/customer/register/verify-otp",
            {
              identifier,
              otp,
            }
          );

          const { token, user } = response.data;
          set({
            isLoading: false,
            isAuthenticated: true,
            token,
            user,
          });
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Invalid OTP";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      loginStaffAdmin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/auth/staff/login", {
            email,
            password,
          });

          const { token, user } = response.data;
          set({
            isLoading: false,
            isAuthenticated: true,
            token,
            user,
          });
          return true;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Invalid credentials";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      registerStaffAdmin: async (
        name: string,
        email: string,
        password: string,
        role: "STAFF" | "ADMIN"
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/auth/staff/register", {
            name,
            email,
            password,
            role,
          });

          const { token, user } = response.data;
          set({
            isLoading: false,
            isAuthenticated: true,
            token,
            user,
          });
          return true;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
