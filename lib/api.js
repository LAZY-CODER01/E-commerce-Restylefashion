import axios from "axios";

/** Deployed API (public). Public sites cannot call localhost — browser blocks it. */
const PRODUCTION_API_BASE = "https://e-commerce-restylefashion-3325.vercel.app/api";

/** Local backend (see backend/.env `PORT`). */
const LOCAL_API_BASE = "http://localhost:5001/api";

/**
 * Resolves API base URL at runtime (important for Vercel: env must not point at localhost).
 * Prefer `NEXT_PUBLIC_API_URL` in `.env.local` / Vercel project settings.
 */
export function getApiBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return LOCAL_API_BASE;
    return PRODUCTION_API_BASE;
  }

  if (process.env.VERCEL === "1") return PRODUCTION_API_BASE;
  return LOCAL_API_BASE;
}

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseURL();
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
