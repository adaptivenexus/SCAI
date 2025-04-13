"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  storeTokens,
  getStoredTokens,
  clearTokens,
  isAuthenticated,
} from "@/utils/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored tokens on mount
    const { userData } = getStoredTokens();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        toast.error("Invalid email or password");
        return;
      }

      const { tokens, agency } = await response.json();

      // Store tokens and user data
      storeTokens(tokens.access, tokens.refresh, agency);
      setUser(agency);

      // Get redirect path from URL or default to dashboard
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect") || "/dashboard/overview";

      // Redirect to the intended destination
      router.push(redirectPath);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/auth/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
