import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL:
    // import.meta.env.VITE_API_URL || "https://hotel-backend-ifst.onrender.com",
    "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/staff-login";
    }
    return Promise.reject(error);
  }
);

export default api;
