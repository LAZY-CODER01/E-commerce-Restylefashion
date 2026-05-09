import axios from "axios";

/** Local Express (must match backend/.env `PORT`; next.config rewrite default uses 5001). */
const LOCAL_API_BASE = "http://localhost:5001/api";

/**
 * Resolved base path for REST calls.
 * - Production browser: `/api` (same origin; proxied via next.config rewrites → BACKEND_URL).
 * - Explicit `NEXT_PUBLIC_API_URL` overrides everything (cross-origin debugging only).
 */
export function getApiBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return LOCAL_API_BASE;
    return "/api";
  }

  // Server-side: hit this deployment so rewrites run (middleware / RSC).
  const vercel = process.env.VERCEL_URL;
  if (vercel && process.env.VERCEL === "1") return `https://${vercel}/api`;

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
