"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("restyle_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/profile");
          // Merge so /auth/login shape (includes token from token field) stays consistent after refresh,
          // and GET always wins on profile fields including dateOfBirth / gender when backend supports them.
          const t = localStorage.getItem("restyle_token");
          setUser((prev) => ({
            ...(prev && typeof prev === "object" ? prev : {}),
            ...data,
            ...(t ? { token: t } : {}),
          }));
        } catch (error) {
          console.error("Failed to fetch profile", error);
          localStorage.removeItem("restyle_token");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password, options = {}) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("restyle_token", data.token);

      if (!options.skipRedirect) {
        redirectBasedOnRole(data.role);
      }
      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  const register = async (userData, options = {}) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setUser(data);
      localStorage.setItem("restyle_token", data.token);

      if (!options.skipRedirect) {
        redirectBasedOnRole(data.role);
      }
      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "Admin":
        router.push("/admin/dashboard");
        break;
      case "Seller":
      case "Influencer":
        router.push("/");
        break;
      case "User":
      default:
        router.push("/");
        break;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("restyle_token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, redirectBasedOnRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
