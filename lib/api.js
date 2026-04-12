import axios from "axios";

/**
 * Local: match backend PORT (see backend/.env). Production: set on deploy host, e.g.
 * NEXT_PUBLIC_API_URL=https://e-commerce-restylefashion-3325.vercel.app/api
 */
const baseURL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:5001/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("restyle_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
