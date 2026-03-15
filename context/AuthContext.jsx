"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Basic mock authentication
  useEffect(() => {
    const storedUser = localStorage.getItem("restyle_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    // mock api call
    setUser(userData);
    localStorage.setItem("restyle_user", JSON.stringify(userData));

    // Role-based redirection
    switch (userData.role) {
      case "Admin":
        router.push("/admin/dashboard");
        break;
      case "Seller":
        router.push("/seller/dashboard");
        break;
      case "Influencer":
        router.push("/influencer/profile");
        break;
      case "User":
      default:
        router.push("/home");
        break;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("restyle_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
