// src/utils/axiosConfig.ts
import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API RESPONSE:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log("❌ API ERROR:", error.config?.url);
    return Promise.reject(error);
  },
);

export default api;
