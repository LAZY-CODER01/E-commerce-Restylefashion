import axios from "axios";

/** Deployed API (public). Set `NEXT_PUBLIC_API_URL` if this host does not serve your Express routes. */
const PRODUCTION_API_BASE = "https://e-commerce-restylefashion-sigma.vercel.app/api";

/** Local Express (see backend/.env `PORT`). Used for server-side / when no browser. */
const LOCAL_API_BASE = "http://localhost:5001/api";

/** Ensure baseURL ends with `/` so axios joins `baseURL + url` correctly when `url` has no leading slash. */
function withTrailingSlash(base) {
  const b = (base || "").replace(/\/$/, "");
  return `${b}/`;
}

/**
 * Resolves API base URL at runtime.
 * - Prefer `NEXT_PUBLIC_API_URL` in `.env.local` / Vercel (full base including `/api`, no trailing slash required).
 * - In **Next.js development** in the browser, use **same origin** `/api/` so `next.config.mjs` rewrites hit Express
 *   (fixes 404 when opening the app via LAN IP and avoids calling the wrong production host).
 * - In production in the browser (no env), use `PRODUCTION_API_BASE` (must actually expose your API routes).
 */
export function getApiBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  if (fromEnv) {
    return withTrailingSlash(fromEnv.replace(/\/$/, ""));
  }

  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") {
      return withTrailingSlash(`${window.location.origin}/api`);
    }
    return withTrailingSlash(PRODUCTION_API_BASE);
  }

  if (process.env.VERCEL === "1") {
    return withTrailingSlash(PRODUCTION_API_BASE);
  }
  return withTrailingSlash(LOCAL_API_BASE);
}

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseURL();
    // `baseURL` ends with `/api/` — strip leading `/` from paths like `/wallet` so axios does not drop the `/api` segment.
    if (typeof config.url === "string" && config.url.startsWith("/")) {
      config.url = config.url.slice(1);
    }
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("restyle_token") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
