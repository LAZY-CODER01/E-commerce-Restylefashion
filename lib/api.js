import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

// Add a request interceptor to include the auth token
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
